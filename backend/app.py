from functools import lru_cache
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from typing import List, Tuple
from config import Settings
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"],
                           deprecated="auto")


@lru_cache()
def get_config() -> Settings:
    return Settings()


@AuthJWT.load_config
def get_jwt_config() -> List[Tuple]:
    return [
        ("AUTHJWT_SECRET_KEY", get_config().authjwt_secret_key),
        ("AUTHJWT_ACCESS_TOKEN_EXPIRES", get_config().authjwt_access_token_expires)
    ]


bb = FastAPI()
motor_client = AsyncIOMotorClient(get_config().mongo_db_url)
database = motor_client["bb_crm"]


@bb.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


def get_database() -> AsyncIOMotorDatabase:
    return database


from routers.auth import router as login_router
bb.include_router(login_router, prefix='/auth', tags=['auth'])


@bb.get('/health')
async def hello(config: Settings = Depends(get_config)):
    return {"config": { "app_name": config.app_name, "test_var": config.test_var }}


@bb.get('/protected')
async def protected(authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    current_username = authorize.get_jwt_subject()
    return current_username
