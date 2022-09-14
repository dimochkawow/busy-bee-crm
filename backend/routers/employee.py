from fastapi import APIRouter, Depends, status, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi_jwt_auth import AuthJWT
from models.auth import EmployeeUpdate, EmployeeResponse, EmployeeDB
from utils.db import EntityLoader
from app import get_database



router = APIRouter()
employee_loader = EntityLoader(collection="employees", 
                               entity_type=EmployeeResponse)

@router.patch('/{id}', response_model=EmployeeResponse)
async def update(employee_update: EmployeeUpdate,
                 employee: EmployeeDB = Depends(employee_loader.get_or_404),
                 db: AsyncIOMotorDatabase = Depends(get_database),
                 authorize: AuthJWT = Depends()) -> EmployeeResponse:
    authorize.jwt_required()
    await db["employees"].update_one(
        {"_id": employee.id}, {"$set": employee_update.dict(exclude_unset=True)}
    )
    employee = await employee_loader.get_or_404(employee.id, db)
    return employee


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete(employee: EmployeeDB = Depends(employee_loader.get_or_404),
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
