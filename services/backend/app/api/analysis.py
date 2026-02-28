from fastapi import APIRouter

from app.api.deps import CurrentUserId, DbSession
from app.repositories.analysis_repository import AnalysisRepository
from app.schemas.analysis import AnalysisHistoryResponse, AnalysisResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix='/api/v1/analysis', tags=['analysis'])


def _to_response(record) -> AnalysisResponse:
    range_of_motion = None
    if record.min_angle is not None and record.max_angle is not None:
        range_of_motion = round(record.max_angle - record.min_angle, 2)

    return AnalysisResponse(
        video_id=record.video_id,
        status=record.status,
        min_angle=record.min_angle,
        max_angle=record.max_angle,
        range_of_motion=range_of_motion,
        movement_score=record.movement_score,
        error_code=record.error_code,
        error_message=record.error_message,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.get('/history', response_model=AnalysisHistoryResponse)
def get_analysis_history(user_id: CurrentUserId, db: DbSession) -> AnalysisHistoryResponse:
    service = AnalysisService(AnalysisRepository(db))
    items = service.list_for_user(user_id)
    return AnalysisHistoryResponse(items=[_to_response(item) for item in items])


@router.get('/{video_id}', response_model=AnalysisResponse)
def get_analysis(video_id: int, user_id: CurrentUserId, db: DbSession) -> AnalysisResponse:
    service = AnalysisService(AnalysisRepository(db))
    analysis = service.get_for_user(user_id=user_id, video_id=video_id)
    return _to_response(analysis)
