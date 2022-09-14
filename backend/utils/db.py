from typing import Any
from bson import ObjectId, errors
from fastapi import HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app import get_database


async def get_object_id(id: str) -> ObjectId:
    try:
        return ObjectId(id)
    except (errors.InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


class EntityLoader:
    def __init__(self, collection: str, entity_type: Any):
        self.collection = collection
        self.entity_type = entity_type
    
    async def get_or_404(self, 
                       id: ObjectId = Depends(get_object_id),
                       db: AsyncIOMotorDatabase = Depends(get_database)) -> Any:
        raw_entity = await db[self.collection].find_one({"_id": id})

        if raw_entity is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
        return self.entity_type(**raw_entity)


# DEPRECATED
# async def get_entity_or_404(
#     collection: str,
#     entity_type: Any,
#     id: ObjectId = Depends(get_object_id),
#     db: AsyncIOMotorDatabase = Depends(get_database),
# ) -> Any:
#     raw_entity = await db[collection].find_one({"_id": id})

#     if raw_entity is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
#     return entity_type(**raw_entity)
