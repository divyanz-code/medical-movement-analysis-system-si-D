import json
import logging

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

    def create_pending(self, video_id: int, analysis_type: str = 'movement') -> Analysis:
        return self.repo.create_pending(video_id=video_id, analysis_type=analysis_type)

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

        analysis = analysis_repo.find_by_video_id(video_id)
        if analysis is None:
            return

        analysis_repo.set_processing(analysis.id)

        # Retrieve the video and eager-load user profile to identify the target joint
        from sqlalchemy.orm import joinedload
        from app.models.video import Video
        from app.models.user import User
        video = session.query(Video).options(
            joinedload(Video.user).joinedload(User.profile)
        ).filter(Video.id == video_id).first()

        if video is None:
            analysis_repo.set_failed(analysis_id=analysis.id, error_code='VIDEO_NOT_FOUND', error_message='Video not found')
            return

        # Choose analyzer based on analysis_type
        from app.services.analysis_engine import (
            MediaPipeAnalyzer, FaceMeshAnalyzer, JOINT_LANDMARK_TRIPLETS,
            JointNotVisibleError, FaceNotDetectedError,
        )

        if analysis.analysis_type == 'facial_expression':
            analyzer = FaceMeshAnalyzer(frame_step=5)
        elif isinstance(analyzer, MediaPipeAnalyzer):
            # Dynamically instantiate MediaPipeAnalyzer for the user's affected limb
            target_joint = "left_elbow"
            if video.user and video.user.profile and video.user.profile.affected_limb:
                limb = video.user.profile.affected_limb.lower().strip()
                if limb in JOINT_LANDMARK_TRIPLETS:
                    target_joint = limb
            
            analyzer = MediaPipeAnalyzer(
                joint=target_joint,
                frame_step=analyzer.frame_step,
                visibility_threshold=analyzer.visibility_threshold
            )

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
        except JointNotVisibleError as exc:
            error_msg = str(exc)
            logging.getLogger(__name__).warning("Analysis validation failed: %s", error_msg)
            analysis_repo.set_failed(
                analysis_id=analysis.id,
                error_code='JOINT_NOT_VISIBLE',
                error_message=error_msg,
            )
        except FaceNotDetectedError as exc:
            error_msg = str(exc)
            logging.getLogger(__name__).warning("Face detection failed: %s", error_msg)
            analysis_repo.set_failed(
                analysis_id=analysis.id,
                error_code='FACE_NOT_DETECTED',
                error_message=error_msg,
            )
        except Exception as exc:
            logging.getLogger(__name__).error(
                "Analysis processing error: %s: %s",
                type(exc).__name__,
                exc,
            )
            analysis_repo.set_failed(
                analysis_id=analysis.id,
                error_code='ANALYSIS_PROCESSING_FAILED',
                error_message='Failed to process movement analysis',
            )
    finally:
        session.close()
