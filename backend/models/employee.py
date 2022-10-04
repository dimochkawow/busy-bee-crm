from fastapi_camelcase import CamelModel
from typing import Optional
from models.base import MongoBaseModel


class AutocompleteSearchPayload(MongoBaseModel, CamelModel):
    full_name: str
    profile_pic_url: Optional[str]
    email: str
