from fastapi import UploadFile

from app.core.config import Settings
from app.core.errors import DomainError
from app.models.video import Video
from app.repositories.video_repository import VideoRepository
from app.services.storage_service import VideoStorage


class VideoService:
    def __init__(self, repo: VideoRepository, storage: VideoStorage, settings: Settings) -> None:
        self.repo = repo
        self.storage = storage
        self.settings = settings

    async def upload_video(self, *, user_id: int, file: UploadFile, duration_seconds: int) -> Video:
        if duration_seconds < self.settings.min_video_duration_seconds or duration_seconds > self.settings.max_video_duration_seconds:
            raise DomainError(
                status_code=400,
                code='INVALID_DURATION',
                message=f'Duration must be between {self.settings.min_video_duration_seconds} and {self.settings.max_video_duration_seconds} seconds',
            )

        content_type = file.content_type or ''
        if not content_type.startswith('video/'):
            raise DomainError(status_code=415, code='UNSUPPORTED_MEDIA_TYPE', message='Only video uploads are allowed')

        file.file.seek(0, 2)
        file_size_bytes = file.file.tell()
        file.file.seek(0)

        max_bytes = self.settings.max_video_size_mb * 1024 * 1024
        if file_size_bytes > max_bytes:
            raise DomainError(
                status_code=413,
                code='FILE_TOO_LARGE',
                message=f'Video exceeds {self.settings.max_video_size_mb} MB limit',
            )

        upload_result = await self.storage.upload_video(file=file, folder=self.settings.cloudinary_folder)

        return self.repo.create_video(
            user_id=user_id,
            cloud_url=upload_result.secure_url,
            cloud_public_id=upload_result.public_id,
            duration_seconds=duration_seconds,
            content_type=content_type,
            file_size_bytes=file_size_bytes,
        )

    def get_video_for_user(self, *, user_id: int, video_id: int) -> Video:
        video = self.repo.find_by_id(video_id)
        if video is None:
            raise DomainError(status_code=404, code='VIDEO_NOT_FOUND', message='Video not found')

        if video.user_id != user_id:
            raise DomainError(status_code=403, code='FORBIDDEN_RESOURCE', message='Access denied for this video')

        return video
