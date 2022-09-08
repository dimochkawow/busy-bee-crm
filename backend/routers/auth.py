from typing import Optional
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi_jwt_auth import AuthJWT
from models.auth import EmployeeCreate, EmployeeResponse, EmployeeDB
from app import get_database, pwd_context
from utils.db import get_entity_or_404


router = APIRouter()


@router.post("/register", response_model=EmployeeResponse, 
             status_code=status.HTTP_201_CREATED,
             response_model_by_alias=False)
async def register(employee: EmployeeCreate, 
                   db: AsyncIOMotorDatabase = Depends(get_database)) -> EmployeeResponse:
    if employee.password != employee.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Passwords do not match") 
    
    employee_db = EmployeeDB(**employee.dict(), 
                             hashed_password=pwd_context.hash(employee.password))
    await db["employees"].insert_one(employee_db.dict(by_alias=True))
    employee_response = await get_entity_or_404(
        collection="employees",
        entity_type=EmployeeResponse,
        id=employee_db.id,
        db=db)
    return employee_response


async def authenticate(email: str, password: str, 
                       db: AsyncIOMotorDatabase = Depends(get_database)) -> Optional[EmployeeDB]:
    employee = await db["employees"].find_one({"email": email})
    
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee with e-mail {email} is not found")

    if not pwd_context.verify(password, employee["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Password is incorrect")
    
    return employee


async def create_access_token(employee: EmployeeDB, 
                              authorize: AuthJWT,
                              db: AsyncIOMotorDatabase = Depends(get_database)):
    access_token = authorize.create_access_token(subject=employee.email)
    await db["employees"].update_one({"_id": employee.id}, 
                                     {"$set": {"token": access_token}})
    return access_token


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(OAuth2PasswordRequestForm),
                authorize: AuthJWT = Depends(),
                db: AsyncIOMotorDatabase = Depends(get_database)):
    email = form_data.username
    password = form_data.password
    employee = await authenticate(email, password, db)
    employee_db = EmployeeDB(**employee)
    token = await create_access_token(employee_db, authorize, db)
    
    return {"token": token, "token_type": "bearer"}
