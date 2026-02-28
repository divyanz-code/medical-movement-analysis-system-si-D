from datetime import datetime

from pydantic import BaseModel


class VideoUploadResponse(BaseModel):
    video_id: int
    status: str


class VideoResponse(BaseModel):
    id: int
    user_id: int
    cloud_url: str
    cloud_public_id: str
    duration_seconds: int
    content_type: str
    file_size_bytes: int
    created_at: datetime
