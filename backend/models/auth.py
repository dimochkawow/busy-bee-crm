from datetime import datetime
from fastapi_camelcase import CamelModel
from pydantic import Field, validator
from typing import Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(CamelModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        json_encoders = { ObjectId: str }


class EmployeeBase(CamelModel):
    full_name: str
    email: str
    password_expired: Optional[bool] = False
    is_admin: Optional[bool] = False
    is_active: Optional[bool] = False


class EmployeeCreate(EmployeeBase):
    password: str
    confirm_password: str


class EmployeeResponse(MongoBaseModel, EmployeeBase):
    token: Optional[str]
    profile_pic_url: Optional[str]
    last_login_at: Optional[datetime]


class EmployeeUpdate(EmployeeResponse):
    full_name: Optional[str]
    email: Optional[str]
    
    @validator("lastLoginAt", pre=True, check_fields=False)
    def past_lastLoginAt(cls, value):
        return datetime.strftime(value, "%Y-%m-%d %H:%M:%S")


class EmployeeDB(EmployeeResponse):
    hashed_password: str
