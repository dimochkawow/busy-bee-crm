from pydantic import BaseModel, Field
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


class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        json_encoders = { ObjectId: str }


class EmployeeBase(BaseModel):
    email: str
    password_expired: Optional[bool] = False
    is_admin: Optional[bool] = False
    is_active: Optional[bool] = True


class EmployeeCreate(EmployeeBase):
    password: str
    confirm_password: str


class EmployeeResponse(MongoBaseModel, EmployeeBase):
    token: Optional[str]
    profile_pic_url: Optional[str]
    full_name: Optional[str]


class EmployeeUpdate(EmployeeResponse):
    pass


class EmployeeDB(EmployeeResponse):
    hashed_password: str
