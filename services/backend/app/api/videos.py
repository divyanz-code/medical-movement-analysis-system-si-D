from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Request, UploadFile

from app.api.deps import CurrentUserId, DbSession, get_settings, get_video_storage, rate_limit_upload
from app.core.config import Settings
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.video_repository import VideoRepository
from app.schemas.video import VideoResponse, VideoUploadResponse
from app.services.analysis_service import AnalysisService, process_analysis_for_video
from app.services.analysis_engine import MovementAnalyzer
from app.services.storage_service import VideoStorage
from app.services.video_service import VideoService

router = APIRouter(prefix='/api/v1/videos', tags=['videos'])


@router.post('', response_model=VideoUploadResponse, status_code=202)
async def upload_video(
    request: Request,
    background_tasks: BackgroundTasks,
    user_id: CurrentUserId,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
    storage: Annotated[VideoStorage, Depends(get_video_storage)],
    _rate_limit: Annotated[None, Depends(rate_limit_upload)],
    video: UploadFile = File(...),
    duration_seconds: int = Form(...),
) -> VideoUploadResponse:
    service = VideoService(VideoRepository(db), storage, settings)
    created = await service.upload_video(user_id=user_id, file=video, duration_seconds=duration_seconds)

    analysis_service = AnalysisService(AnalysisRepository(db))
    analysis = analysis_service.create_pending(created.id)

    session_factory = request.app.state.session_factory
    analyzer: MovementAnalyzer = request.app.state.analysis_engine
    background_tasks.add_task(
        process_analysis_for_video,
        session_factory=session_factory,
        analyzer=analyzer,
        video_id=created.id,
    )

    return VideoUploadResponse(video_id=created.id, status=analysis.status)


@router.get('/{video_id}', response_model=VideoResponse)
def get_video(
    video_id: int,
    user_id: CurrentUserId,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> VideoResponse:
    service = VideoService(VideoRepository(db), None, settings)
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
