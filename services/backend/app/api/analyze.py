from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=['analyze'])


class AnalyzeRequest(BaseModel):
    video_url: str = Field(min_length=1)


class AnalyzeResponse(BaseModel):
    min_angle: float
    max_angle: float
    movement_score: float
    raw_json: dict


@router.post('/analyze', response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    if not payload.video_url.startswith('http'):
        raise HTTPException(status_code=400, detail='invalid video url')

    return AnalyzeResponse(
        min_angle=22.5,
        max_angle=87.0,
        movement_score=0.82,
        raw_json={'model': 'baseline', 'version': 'v0'},
    )
