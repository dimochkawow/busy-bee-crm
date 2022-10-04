import base64
import io
from typing import List, Tuple
from starlette.responses import StreamingResponse
from fastapi import (APIRouter, Depends, status, HTTPException, 
                     Form, UploadFile, Query)
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi_jwt_auth import AuthJWT
from models.auth import EmployeeUpdate, EmployeeResponse, EmployeeDB, ChangePasswordPayload
from models.employee import AutocompleteSearchPayload
from utils.db import EntityLoader, pagination
from app import get_database, get_config, pwd_context
from utils.aws import upload_file, download_file
from utils.exceptions import BBAWSIntegrationException



router = APIRouter()
employee_loader = EntityLoader(collection="employees", 
                               entity_type=EmployeeResponse)
employee_db_loader = EntityLoader(collection="employees",
                                  entity_type=EmployeeDB)


@router.get('/autocomplete')
async def autocomplete(q: str = Query(...),
                       db: AsyncIOMotorDatabase = Depends(get_database),
                       authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    pipeline = [
        {"$search": {"autocomplete": {"query": q, "path": "fullName"}}},
        {"$limit": 10},
        {"$project": {"_id": 1, "fullName": 1, "profilePicUrl": 1, "email": 1}}
    ]
    results = await db["employees"].aggregate(pipeline).to_list(length=10)
    employees = [AutocompleteSearchPayload(**raw_result) for raw_result in results]
    return employees


@router.get('/')
async def find_all(pagination: Tuple[int, int] = Depends(pagination),
                   db: AsyncIOMotorDatabase = Depends(get_database),
                   authorize: AuthJWT = Depends()) -> List[EmployeeResponse]:
    authorize.jwt_required()
    skip, limit = pagination
    query = db["employees"].find({}, skip=skip, limit=limit)
    results = [EmployeeResponse(**raw_employee) async for raw_employee in query]
    return results


@router.patch('/{id}', response_model=EmployeeResponse)
async def update(employee_update: EmployeeUpdate,
                 employee: EmployeeResponse = Depends(employee_loader.get_or_404),
                 db: AsyncIOMotorDatabase = Depends(get_database),
                 authorize: AuthJWT = Depends()) -> EmployeeResponse:
    authorize.jwt_required()
    await db["employees"].update_one(
        {"_id": employee.id}, {"$set": employee_update.dict(exclude_unset=True, by_alias=True)}
    )
    employee = await employee_loader.get_or_404(employee.id, db)
    return employee


@router.get('/{id}/profile')
async def profile(employee: EmployeeResponse = Depends(employee_loader.get_or_404),
                  authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    raw_jwt = authorize.get_raw_jwt()
    current_is_admin = raw_jwt["is_admin"]
    current_username = raw_jwt["sub"]
    
    if not current_is_admin and current_username != employee.email:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="""Only admin employees are permitted to see another profiles""")
    
    return employee
    

@router.post('/{id}/profile/upload')
async def upload(file: UploadFile,
                 employee: EmployeeResponse = Depends(employee_loader.get_or_404),
                 authorize: AuthJWT = Depends(),
                 db: AsyncIOMotorDatabase = Depends(get_database)):
    authorize.jwt_required()
    full_name_split = employee.full_name.split(" ")
    folder_name = "_".join(full_name_split)
    
    with io.BytesIO(await file.read()) as f:
        try:
            upload_file(f, f"{folder_name}/{file.filename}", get_config().aws_s3_bucket_name)
        except BBAWSIntegrationException as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                details=str(e.message))
    
    s3_object_name = f"{folder_name}/{file.filename}"
    
    await db["employees"].update_one({"_id": employee.id}, {"$set": {"profilePicUrl": s3_object_name}})
    return {"profilePicUrl": s3_object_name}


@router.get('/{id}/profile/download')
async def download(employee: EmployeeResponse = Depends(employee_loader.get_or_404)):
    try:
        file = download_file(get_config().aws_s3_bucket_name, employee.profile_pic_url)
        return StreamingResponse(file, media_type="image/png")
    except BBAWSIntegrationException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            details=str(e.message))


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete(employee: EmployeeResponse = Depends(employee_loader.get_or_404),
                 db: AsyncIOMotorDatabase = Depends(get_database),
                 authorize: AuthJWT = Depends()):
     authorize.jwt_required()
     raw_jwt = authorize.get_raw_jwt()
     current_username = raw_jwt["sub"]
     current_is_admin = raw_jwt["is_admin"]
     
     if current_is_admin and employee.email != current_username:
         await db["employees"].delete_one({"_id": employee.id})
     else:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="""Only admin employees can delete another ones 
                                        or you're trying to delete yourself :)""")


@router.post('/{id}/changePassword', status_code=status.HTTP_204_NO_CONTENT)
async def change_password(changePasswordPayload: ChangePasswordPayload,
                          employee: EmployeeDB = Depends(employee_db_loader.get_or_404),
                          db: AsyncIOMotorDatabase = Depends(get_database),
                          authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    
    if not pwd_context.verify(changePasswordPayload.oldPassword, employee.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Old password is incorrect")
    
    new_hashed_password = pwd_context.hash(changePasswordPayload.newPassword)
    await db["employees"].update_one({"_id": employee.id}, {"$set": {"hashedPassword": new_hashed_password}})
