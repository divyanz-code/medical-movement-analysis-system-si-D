from datetime import datetime

from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    video_id: int
    status: str
    min_angle: float | None = None
    max_angle: float | None = None
    range_of_motion: float | None = None
    movement_score: float | None = None
    error_code: str | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime


class AnalysisHistoryResponse(BaseModel):
    items: list[AnalysisResponse]
