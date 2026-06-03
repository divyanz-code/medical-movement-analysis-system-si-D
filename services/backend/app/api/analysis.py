from fastapi import APIRouter, HTTPException, Response

from app.api.deps import CurrentUserId, DbSession
from app.repositories.analysis_repository import AnalysisRepository
from app.schemas.analysis import AnalysisHistoryResponse, AnalysisResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix='/api/v1/analysis', tags=['analysis'])


def _to_response(record) -> AnalysisResponse:
    import json as _json

    range_of_motion = None
    if record.min_angle is not None and record.max_angle is not None:
        range_of_motion = round(record.max_angle - record.min_angle, 2)

    expression_summary = None
    landmark_image_base64 = None
    calibration_frame_base64 = None
    success_frame_base64 = None
    tracking_frame_base64 = None
    per_frame_blendshapes = None
    analysis_type = getattr(record, 'analysis_type', 'movement') or 'movement'
    if record.raw_json:
        try:
            raw = _json.loads(record.raw_json)
            landmark_image_base64 = raw.get('landmark_image_base64')
            if analysis_type == 'facial_expression':
                expression_summary = raw.get('expression_summary')
                per_frame_blendshapes = raw.get('per_frame_blendshapes')
            elif analysis_type == 'movement':
                calibration_frame_base64 = raw.get('calibration_frame_base64')
                success_frame_base64 = raw.get('success_frame_base64')
                tracking_frame_base64 = raw.get('tracking_frame_base64')
        except (ValueError, TypeError):
            pass

    return AnalysisResponse(
        video_id=record.video_id,
        analysis_type=analysis_type,
        status=record.status,
        min_angle=record.min_angle,
        max_angle=record.max_angle,
        range_of_motion=range_of_motion,
        movement_score=record.movement_score,
        expression_summary=expression_summary,
        landmark_image_base64=landmark_image_base64,
        calibration_frame_base64=calibration_frame_base64,
        success_frame_base64=success_frame_base64,
        tracking_frame_base64=tracking_frame_base64,
        per_frame_blendshapes=per_frame_blendshapes,
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


@router.get('/{video_id}/landmark-image')
def get_landmark_image(video_id: int, user_id: CurrentUserId, db: DbSession) -> Response:
    import json as _json
    import base64
    service = AnalysisService(AnalysisRepository(db))
    analysis = service.get_for_user(user_id=user_id, video_id=video_id)
    if not analysis.raw_json:
        raise HTTPException(status_code=404, detail="Landmark image not found")

    try:
        raw = _json.loads(analysis.raw_json)
        b64 = raw.get("landmark_image_base64")
        if not b64:
            raise HTTPException(status_code=404, detail="Landmark image not found")
        img_bytes = base64.b64decode(b64)
        return Response(content=img_bytes, media_type="image/png")
    except Exception:
        raise HTTPException(status_code=404, detail="Landmark image not found")
