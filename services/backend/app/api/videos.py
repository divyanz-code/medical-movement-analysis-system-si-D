from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import CurrentUserId, DbSession, get_settings, get_video_storage
from app.core.config import Settings
from app.repositories.video_repository import VideoRepository
from app.schemas.video import VideoResponse, VideoUploadResponse
from app.services.storage_service import VideoStorage
from app.services.video_service import VideoService

router = APIRouter(prefix='/api/v1/videos', tags=['videos'])


@router.post('', response_model=VideoUploadResponse, status_code=202)
async def upload_video(
    user_id: CurrentUserId,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
    storage: Annotated[VideoStorage, Depends(get_video_storage)],
    video: UploadFile = File(...),
    duration_seconds: int = Form(...),
) -> VideoUploadResponse:
    service = VideoService(VideoRepository(db), storage, settings)
    created = await service.upload_video(user_id=user_id, file=video, duration_seconds=duration_seconds)
    return VideoUploadResponse(video_id=created.id, status='PENDING')


@router.get('/{video_id}', response_model=VideoResponse)
def get_video(
    video_id: int,
    user_id: CurrentUserId,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
    storage: Annotated[VideoStorage, Depends(get_video_storage)],
) -> VideoResponse:
    service = VideoService(VideoRepository(db), storage, settings)
    video = service.get_video_for_user(user_id=user_id, video_id=video_id)
    return VideoResponse(
        id=video.id,
        user_id=video.user_id,
        cloud_url=video.cloud_url,
        cloud_public_id=video.cloud_public_id,
        duration_seconds=video.duration_seconds,
        content_type=video.content_type,
        file_size_bytes=video.file_size_bytes,
        created_at=video.created_at,
    )
