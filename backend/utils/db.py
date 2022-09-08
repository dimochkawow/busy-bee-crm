from typing import Any
from bson import ObjectId, errors
from fastapi import HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app import get_database
from models.auth import EmployeeResponse, EmployeeDB


async def get_object_id(id: str) -> ObjectId:
    try:
        ObjectId(id)
    except (errors.InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


async def get_entity_or_404(
    collection: str,
    entity_type: Any,
    id: ObjectId = Depends(get_object_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Any:
    raw_entity = await db[collection].find_one({"_id": id})

    if raw_entity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return entity_type(**raw_entity)
