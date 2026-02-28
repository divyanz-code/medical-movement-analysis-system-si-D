from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'mma-backend'
    app_version: str = '0.3.0'
    environment: str = 'development'

    database_url: str = Field(
        default='sqlite+pysqlite:///./services/backend/mma.db',
        description='Database connection string',
    )

    jwt_secret: str = Field(default='change-me-in-prod', min_length=16)
    jwt_algorithm: str = 'HS256'
    jwt_access_token_exp_minutes: int = Field(default=60, ge=5, le=1440)

    request_body_limit_mb: int = Field(default=1, ge=1, le=20)

    max_video_size_mb: int = Field(default=50, ge=1, le=200)
    min_video_duration_seconds: int = Field(default=5, ge=1, le=60)
    max_video_duration_seconds: int = Field(default=15, ge=1, le=300)

    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    cloudinary_folder: str = 'mma/videos'


def get_settings() -> Settings:
    return Settings()
