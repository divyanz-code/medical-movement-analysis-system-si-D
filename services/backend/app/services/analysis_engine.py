from dataclasses import dataclass
from typing import Protocol


@dataclass
class AnalysisResult:
    min_angle: float
    max_angle: float
    movement_score: float
    raw_json: dict


class MovementAnalyzer(Protocol):
    def analyze(self, *, video_url: str) -> AnalysisResult: ...


class LocalHeuristicAnalyzer(MovementAnalyzer):
    def analyze(self, *, video_url: str) -> AnalysisResult:
        if not video_url.startswith('http'):
            raise ValueError('Invalid video URL for analysis')

        # Deterministic placeholder for MVP while real model integration is pending.
        return AnalysisResult(
            min_angle=22.5,
            max_angle=87.0,
            movement_score=0.82,
            raw_json={'model': 'baseline', 'version': 'v0'},
        )
