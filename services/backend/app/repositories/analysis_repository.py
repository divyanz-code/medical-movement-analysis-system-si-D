from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.analysis import Analysis
from app.models.video import Video


class AnalysisRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_pending(self, *, video_id: int, analysis_type: str = 'movement') -> Analysis:
        analysis = Analysis(video_id=video_id, analysis_type=analysis_type, status='PENDING')
        self.session.add(analysis)
        self.session.commit()
        self.session.refresh(analysis)
        return analysis

    def find_by_video_id(self, video_id: int) -> Analysis | None:
        stmt = select(Analysis).where(Analysis.video_id == video_id)
        return self.session.scalar(stmt)

    def find_by_video_id_with_video(self, video_id: int) -> Analysis | None:
        stmt = select(Analysis).options(joinedload(Analysis.video)).where(Analysis.video_id == video_id)
        return self.session.scalar(stmt)

    def list_for_user(self, user_id: int) -> list[Analysis]:
        stmt = (
            select(Analysis)
            .join(Video, Analysis.video_id == Video.id)
            .where(Video.user_id == user_id)
            .order_by(Analysis.created_at.desc())
            .options(joinedload(Analysis.video))
        )
        return list(self.session.scalars(stmt).all())

    def set_processing(self, analysis_id: int) -> None:
        analysis = self.session.get(Analysis, analysis_id)
        if analysis is None:
            return
        analysis.status = 'PROCESSING'
        analysis.error_code = None
        analysis.error_message = None
        self.session.add(analysis)
        self.session.commit()

    def set_succeeded(
        self,
        *,
        analysis_id: int,
        min_angle: float,
        max_angle: float,
        movement_score: float,
        raw_json: str,
    ) -> None:
        analysis = self.session.get(Analysis, analysis_id)
        if analysis is None:
            return
        analysis.status = 'SUCCEEDED'
        analysis.min_angle = min_angle
        analysis.max_angle = max_angle
        analysis.movement_score = movement_score
        analysis.raw_json = raw_json
        analysis.error_code = None
        analysis.error_message = None
        self.session.add(analysis)
        self.session.commit()

    def set_failed(self, *, analysis_id: int, error_code: str, error_message: str) -> None:
        analysis = self.session.get(Analysis, analysis_id)
        if analysis is None:
            return
        analysis.status = 'FAILED'
        analysis.error_code = error_code
        analysis.error_message = error_message
        self.session.add(analysis)
        self.session.commit()
