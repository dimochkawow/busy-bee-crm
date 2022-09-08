from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = 'Busy Bee CRM API'
    test_var: str
    mongo_db_url: str
    authjwt_secret_key: str
    authjwt_access_token_expires: int
    
    class Config:
        env_file = '.env'
