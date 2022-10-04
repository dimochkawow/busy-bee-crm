from datetime import datetime
from fastapi_camelcase import CamelModel
from pydantic import Field, validator, root_validator
from typing import Optional
from models.base import MongoBaseModel


class EmployeeBase(CamelModel):
    full_name: str
    email: str
    password_expired: Optional[bool] = False
    is_admin: Optional[bool] = False
    is_active: Optional[bool] = False
    profile_pic_url: Optional[str]
    last_login_at: Optional[datetime]


class EmployeeCreate(EmployeeBase):
    password: str
    confirm_password: str


class EmployeeDB(MongoBaseModel, EmployeeBase):
    hashed_password: str


class EmployeeResponse(MongoBaseModel, EmployeeBase):
    token: Optional[str]
    expires_in: Optional[int]


class EmployeeUpdate(MongoBaseModel, EmployeeBase):
    full_name: Optional[str]
    email: Optional[str]
    
    @validator("lastLoginAt", pre=True, check_fields=False)
    def past_lastLoginAt(cls, value):
        return datetime.strftime(value, "%Y-%m-%d %H:%M:%S")


class ChangePasswordPayload(CamelModel):
    oldPassword: str
    newPassword: str
    confirmPassword: str
    
    @root_validator
    def validate_password_change(cls, values):
        if values.get('oldPassword') == values.get('newPassword'):
            raise ValueError("New password must be different")
        
        if values.get('newPassword') != values.get('confirmPassword'):
            raise ValueError("Password and confirmation must match")
        
        return values
