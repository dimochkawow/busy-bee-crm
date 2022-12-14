from functools import lru_cache
from fastapi import FastAPI, Depends, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import ValidationError
from starlette.middleware.cors import CORSMiddleware
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


bb.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=-1 # TODO: remove this later!
)


@bb.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": exc.message}
    )


@bb.exception_handler(RequestValidationError)
def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.errors()[0].get('msg', '')}
    )


def get_database() -> AsyncIOMotorDatabase:
    return database


from routers.auth import router as login_router
from routers.employee import router as employee_router
bb.include_router(login_router, prefix='/auth', tags=['auth'])
bb.include_router(employee_router, prefix='/employees', tags=['employees'])


@bb.get('/health')
async def hello(config: Settings = Depends(get_config)):
    return {"config": { "app_name": config.app_name, "test_var": config.test_var }}


@bb.get('/protected')
async def protected(authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    current_username = authorize.get_jwt_subject()
    return current_username
