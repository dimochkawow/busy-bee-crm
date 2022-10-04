from typing import Any, Tuple
from bson import ObjectId, errors
from fastapi import HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app import get_database


async def get_object_id(id: str) -> ObjectId:
    try:
        return ObjectId(id)
    except (errors.InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


async def pagination(skip: int = Query(0, ge=0),
                     limit: int = Query(10, ge=0)) -> Tuple[int, int]:
    return (skip, limit)


class EntityLoader:
    def __init__(self, collection: str, entity_type: Any):
        self.collection = collection
        self.entity_type = entity_type
    
    async def get_or_404(self, 
                       id: ObjectId = Depends(get_object_id),
                       db: AsyncIOMotorDatabase = Depends(get_database)) -> Any:
        raw_entity = await db[self.collection].find_one({"_id": id})

        if raw_entity is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"There is no employee with id={id}")
    
        return self.entity_type(**raw_entity)
