from dataclasses import dataclass
import time
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
        self._max_retries = 3
        self._retry_delay_seconds = 0.25

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

        last_exception: Exception | None = None
        upload_response = None
        for attempt in range(self._max_retries):
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
                break
            except Exception as exc:
                last_exception = exc
                if attempt < self._max_retries - 1:
                    time.sleep(self._retry_delay_seconds * (attempt + 1))

        if upload_response is None:
            raise DomainError(status_code=502, code='CLOUD_UPLOAD_FAILED', message='Video upload failed') from last_exception

        public_id = upload_response.get('public_id')
        secure_url = upload_response.get('secure_url')

        if not public_id or not secure_url:
            raise DomainError(status_code=502, code='CLOUD_UPLOAD_FAILED', message='Cloud upload returned invalid data')

        return UploadResult(public_id=public_id, secure_url=secure_url)


class LocalVideoStorage(VideoStorage):
    def __init__(self, settings: Settings) -> None:
        import os
        # Create an uploads folder inside the backend directory
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self._dir = os.path.join(base_dir, "uploads")
        os.makedirs(self._dir, exist_ok=True)

    async def upload_video(self, *, file: UploadFile, folder: str) -> UploadResult:
        import os
        import uuid
        import shutil

        filename = f"{uuid.uuid4()}_{file.filename or 'video.mp4'}"
        dest = os.path.join(self._dir, filename)

        try:
            file.file.seek(0)
            with open(dest, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as exc:
            raise DomainError(status_code=500, code='LOCAL_WRITE_FAILED', message='Failed to save video locally') from exc

        return UploadResult(public_id=f"local/{filename}", secure_url=f"file://{dest}")

