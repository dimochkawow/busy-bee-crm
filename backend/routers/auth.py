from typing import Optional
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi_jwt_auth import AuthJWT
from models.auth import EmployeeCreate, EmployeeResponse, EmployeeDB
from app import get_database, pwd_context, get_config
from utils.db import EntityLoader


router = APIRouter()


@router.post("/register", response_model=EmployeeResponse, 
             status_code=status.HTTP_201_CREATED)
async def register(new_employee: EmployeeCreate, 
                   db: AsyncIOMotorDatabase = Depends(get_database)) -> EmployeeResponse:
    if new_employee.password != new_employee.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Passwords do not match") 
    
    employee_db = EmployeeDB(**new_employee.dict(by_alias=True), 
                             hashed_password=pwd_context.hash(new_employee.password))
    await db["employees"].insert_one(employee_db.dict(by_alias=True))
    employee_response = await EntityLoader(collection="employees", 
                                           entity_type=EmployeeResponse) \
                                .get_or_404(id=employee_db.id, db=db)
    return employee_response


async def authenticate(email: str, password: str, 
                       db: AsyncIOMotorDatabase = Depends(get_database)) -> Optional[EmployeeDB]:
    employee = await db["employees"].find_one({"email": email})
    
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee with e-mail {email} is not found")

    if not pwd_context.verify(password, employee["hashedPassword"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Password is incorrect")
    
    return employee


@router.post("/login", response_model=EmployeeResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(OAuth2PasswordRequestForm),
                authorize: AuthJWT = Depends(),
                db: AsyncIOMotorDatabase = Depends(get_database)) -> EmployeeResponse:
    email = form_data.username
    password = form_data.password
    employee = await authenticate(email, password, db)
    claims = {
        "is_admin": employee["isAdmin"]
    }
    token = authorize.create_access_token(subject=employee["email"],
                                          user_claims=claims)
    employee["token"] = token              
    employee["expires_in"] = get_config().authjwt_access_token_expires
    
    return EmployeeResponse(**employee)
