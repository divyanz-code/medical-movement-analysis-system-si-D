from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.video import Video


class VideoRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_video(
        self,
        *,
        user_id: int,
        cloud_url: str,
        cloud_public_id: str,
        duration_seconds: int,
        content_type: str,
        file_size_bytes: int,
    ) -> Video:
        video = Video(
            user_id=user_id,
            cloud_url=cloud_url,
            cloud_public_id=cloud_public_id,
            duration_seconds=duration_seconds,
            content_type=content_type,
            file_size_bytes=file_size_bytes,
        )
        self.session.add(video)
        self.session.commit()
        self.session.refresh(video)
        return video

    def find_by_id(self, video_id: int) -> Video | None:
        stmt = select(Video).where(Video.id == video_id)
        return self.session.scalar(stmt)
