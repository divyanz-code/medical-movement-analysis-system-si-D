from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    video_id: int
    analysis_type: str = "movement"
    status: str
    min_angle: float | None = None
    max_angle: float | None = None
    range_of_motion: float | None = None
    movement_score: float | None = None
    expression_summary: dict[str, Any] | None = None
    landmark_image_base64: str | None = None
    calibration_frame_base64: str | None = None
    success_frame_base64: str | None = None
    tracking_frame_base64: str | None = None
    per_frame_blendshapes: list[dict[str, float]] | None = None
    error_code: str | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime


class AnalysisHistoryResponse(BaseModel):
    items: list[AnalysisResponse]
