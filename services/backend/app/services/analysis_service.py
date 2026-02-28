import json

from app.core.errors import DomainError
from app.models.analysis import Analysis
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.video_repository import VideoRepository
from app.services.analysis_engine import MovementAnalyzer


def _to_float(value: float | int) -> float:
    return float(value)


class AnalysisService:
    def __init__(self, repo: AnalysisRepository) -> None:
        self.repo = repo

    def create_pending(self, video_id: int) -> Analysis:
        return self.repo.create_pending(video_id=video_id)

    def get_for_user(self, *, user_id: int, video_id: int) -> Analysis:
        analysis = self.repo.find_by_video_id_with_video(video_id)
        if analysis is None:
            raise DomainError(status_code=404, code='ANALYSIS_NOT_FOUND', message='Analysis not found')

        if analysis.video is None or analysis.video.user_id != user_id:
            raise DomainError(status_code=403, code='FORBIDDEN_RESOURCE', message='Access denied for this analysis')

        return analysis

    def list_for_user(self, user_id: int) -> list[Analysis]:
        return self.repo.list_for_user(user_id)


def process_analysis_for_video(*, session_factory, analyzer: MovementAnalyzer, video_id: int) -> None:
    session = session_factory()
    try:
        analysis_repo = AnalysisRepository(session)
        video_repo = VideoRepository(session)

        analysis = analysis_repo.find_by_video_id(video_id)
        if analysis is None:
            return

        analysis_repo.set_processing(analysis.id)

        video = video_repo.find_by_id(video_id)
        if video is None:
            analysis_repo.set_failed(analysis_id=analysis.id, error_code='VIDEO_NOT_FOUND', error_message='Video not found')
            return

        try:
            result = analyzer.analyze(video_url=video.cloud_url)
            min_angle = _to_float(result.min_angle)
            max_angle = _to_float(result.max_angle)
            movement_score = _to_float(result.movement_score)

            if max_angle < min_angle:
                raise ValueError('max_angle is lower than min_angle')
            if movement_score < 0 or movement_score > 1:
                raise ValueError('movement_score must be between 0 and 1')

            analysis_repo.set_succeeded(
                analysis_id=analysis.id,
                min_angle=min_angle,
                max_angle=max_angle,
                movement_score=movement_score,
                raw_json=json.dumps(result.raw_json),
            )
        except Exception:
            analysis_repo.set_failed(
                analysis_id=analysis.id,
                error_code='ANALYSIS_PROCESSING_FAILED',
                error_message='Failed to process movement analysis',
            )
    finally:
        session.close()
