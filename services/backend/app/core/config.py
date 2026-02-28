from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'mma-backend'
    app_version: str = '0.2.0'
    environment: str = 'development'

    database_url: str = Field(
        default='sqlite+pysqlite:///./services/backend/mma.db',
        description='Database connection string',
    )

    jwt_secret: str = Field(default='change-me-in-prod', min_length=16)
    jwt_algorithm: str = 'HS256'
    jwt_access_token_exp_minutes: int = Field(default=60, ge=5, le=1440)

    request_body_limit_mb: int = Field(default=1, ge=1, le=20)


def get_settings() -> Settings:
    return Settings()
