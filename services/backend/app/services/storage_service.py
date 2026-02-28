from dataclasses import dataclass
from typing import Protocol

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.core.config import Settings
from app.core.errors import DomainError


@dataclass
class UploadResult:
    public_id: str
    secure_url: str


class VideoStorage(Protocol):
    async def upload_video(self, *, file: UploadFile, folder: str) -> UploadResult: ...


class CloudinaryVideoStorage(VideoStorage):
    def __init__(self, settings: Settings) -> None:
        self._enabled = bool(
            settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret
        )
        self._folder = settings.cloudinary_folder

        if self._enabled:
            cloudinary.config(
                cloud_name=settings.cloudinary_cloud_name,
                api_key=settings.cloudinary_api_key,
                api_secret=settings.cloudinary_api_secret,
                secure=True,
            )

    async def upload_video(self, *, file: UploadFile, folder: str) -> UploadResult:
        if not self._enabled:
            raise DomainError(
                status_code=503,
                code='STORAGE_NOT_CONFIGURED',
                message='Cloud storage is not configured',
            )

        try:
            file.file.seek(0)
            upload_response = cloudinary.uploader.upload(
                file.file,
                resource_type='video',
                folder=folder or self._folder,
                use_filename=False,
                unique_filename=True,
                overwrite=False,
            )
        except Exception as exc:
            raise DomainError(status_code=502, code='CLOUD_UPLOAD_FAILED', message='Video upload failed') from exc

        public_id = upload_response.get('public_id')
        secure_url = upload_response.get('secure_url')

        if not public_id or not secure_url:
            raise DomainError(status_code=502, code='CLOUD_UPLOAD_FAILED', message='Cloud upload returned invalid data')

        return UploadResult(public_id=public_id, secure_url=secure_url)
