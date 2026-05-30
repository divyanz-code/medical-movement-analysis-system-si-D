"""
analysis_engine.py
==================
Defines the MovementAnalyzer protocol and two concrete implementations:

  1. MediaPipeAnalyzer  — real pose estimation using Google MediaPipe Pose.
  2. LocalHeuristicAnalyzer — deterministic stub kept for unit-test isolation.

Pipeline (MediaPipeAnalyzer):
  Video URL → download to tempfile → OpenCV frame extraction →
  MediaPipe Pose landmarks → joint-angle computation →
  AnalysisResult (min_angle, max_angle, movement_score, raw_json)
"""

from __future__ import annotations

import logging
import math
import os
import tempfile
from dataclasses import dataclass, field
from typing import Protocol

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Landmark triplet definitions (point_a, vertex, point_b)
# Angle is computed AT the vertex between the two arms.
# MediaPipe Pose landmark indices:
#   https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
# ---------------------------------------------------------------------------
JOINT_LANDMARK_TRIPLETS: dict[str, tuple[int, int, int]] = {
    "left_elbow":    (11, 13, 15),  # L-shoulder → L-elbow → L-wrist
    "right_elbow":   (12, 14, 16),  # R-shoulder → R-elbow → R-wrist
    "left_knee":     (23, 25, 27),  # L-hip → L-knee → L-ankle
    "right_knee":    (24, 26, 28),  # R-hip → R-knee → R-ankle
    "left_shoulder": (13, 11, 23),  # L-elbow → L-shoulder → L-hip
    "right_shoulder":(14, 12, 24),  # R-elbow → R-shoulder → R-hip
    "left_hip":      (11, 23, 25),  # L-shoulder → L-hip → L-knee
    "right_hip":     (12, 24, 26),  # R-shoulder → R-hip → R-knee
}

DEFAULT_JOINT = "left_elbow"
VISIBILITY_THRESHOLD = 0.5   # landmarks below this confidence are skipped
FRAME_SAMPLE_STEP = 5        # analyse every Nth frame (controls speed vs. detail)
MIN_VALID_FRAMES = 2         # raise ValueError if fewer valid angles found


# ---------------------------------------------------------------------------
# Data contract
# ---------------------------------------------------------------------------

class JointNotVisibleError(ValueError):
    """Exception raised when MediaPipe cannot find the target joint in enough frames."""
    pass


@dataclass
class AnalysisResult:
    min_angle: float
    max_angle: float
    movement_score: float
    raw_json: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Protocol (interface)
# ---------------------------------------------------------------------------

class MovementAnalyzer(Protocol):
    def analyze(self, *, video_url: str) -> AnalysisResult: ...


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _angle_between_three_points(
    ax: float, ay: float,
    bx: float, by: float,
    cx: float, cy: float,
) -> float:
    """
    Return the angle (in degrees) at point B formed by the vectors B→A and B→C.
    Uses the dot-product formula to avoid atan2 quadrant issues.
    """
    # Vectors from vertex B to A and C
    vba_x, vba_y = ax - bx, ay - by
    vbc_x, vbc_y = cx - bx, cy - by

    dot = vba_x * vbc_x + vba_y * vbc_y
    mag_a = math.hypot(vba_x, vba_y)
    mag_c = math.hypot(vbc_x, vbc_y)

    if mag_a < 1e-9 or mag_c < 1e-9:
        return 0.0  # degenerate — points are co-located

    cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))
    return math.degrees(math.acos(cos_angle))


def _download_video(url: str) -> str:
    """Download video from URL to a named temporary file. Returns the file path.

    Supports both http(s):// remote URLs and file:// local paths (useful for
    testing without Cloudinary).
    """
    # Handle local file:// URLs (e.g. from test/E2E stubs)
    if url.startswith("file://"):
        src_path = url[len("file://"):]
        suffix = os.path.splitext(src_path)[1] or ".mp4"
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        tmp.close()
        import shutil
        shutil.copy2(src_path, tmp.name)
        return tmp.name

    import requests  # imported here so test stubs can patch easily

    suffix = ".mp4"
    # Preserve original extension when discernible
    path_part = url.split("?")[0]
    if "." in os.path.basename(path_part):
        suffix = "." + os.path.basename(path_part).rsplit(".", 1)[-1]

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        with requests.get(url, stream=True, timeout=30, allow_redirects=True) as resp:
            resp.raise_for_status()
            for chunk in resp.iter_content(chunk_size=1 << 16):  # 64 KB chunks
                tmp.write(chunk)
    finally:
        tmp.close()

    return tmp.name


def _extract_frame_angles(
    video_path: str,
    joint: str,
    frame_step: int,
    visibility_threshold: float,
) -> tuple[list[float], int, int]:
    """
    Open *video_path* with OpenCV, run MediaPipe Pose on sampled frames,
    and return (angles_list, total_frames_sampled, frames_with_landmarks).
    """
    import cv2
    import mediapipe as mp  # noqa: PLC0415

    Pose = mp.solutions.pose.Pose  # type: ignore[attr-defined]
    landmark_indices = JOINT_LANDMARK_TRIPLETS[joint]
    idx_a, idx_b, idx_c = landmark_indices

    angles: list[float] = []
    total_sampled = 0
    frames_with_landmarks = 0

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video file: {video_path}")

    try:
        with Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        ) as pose:
            frame_index = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_index % frame_step != 0:
                    frame_index += 1
                    continue

                total_sampled += 1
                frame_index += 1

                # MediaPipe expects RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                result = pose.process(rgb_frame)

                if result.pose_landmarks is None:
                    continue

                lm = result.pose_landmarks.landmark

                # Check visibility of all three landmarks
                vis_a = lm[idx_a].visibility
                vis_b = lm[idx_b].visibility
                vis_c = lm[idx_c].visibility

                if (
                    vis_a < visibility_threshold
                    or vis_b < visibility_threshold
                    or vis_c < visibility_threshold
                ):
                    continue

                frames_with_landmarks += 1
                angle = _angle_between_three_points(
                    lm[idx_a].x, lm[idx_a].y,
                    lm[idx_b].x, lm[idx_b].y,
                    lm[idx_c].x, lm[idx_c].y,
                )
                angles.append(round(angle, 2))
    finally:
        cap.release()

    return angles, total_sampled, frames_with_landmarks


# ---------------------------------------------------------------------------
# Concrete implementations
# ---------------------------------------------------------------------------

class MediaPipeAnalyzer:
    """
    Real analyzer — downloads the video, runs MediaPipe Pose frame-by-frame,
    computes joint angle, and returns statistical summary.

    Parameters
    ----------
    joint : str
        Which joint to measure. One of the keys in JOINT_LANDMARK_TRIPLETS.
        Defaults to ``"left_elbow"``.
    frame_step : int
        Sample every Nth frame. Higher = faster but less precise.
    visibility_threshold : float
        Skip landmarks with confidence below this value (0–1).
    """

    def __init__(
        self,
        joint: str = DEFAULT_JOINT,
        frame_step: int = FRAME_SAMPLE_STEP,
        visibility_threshold: float = VISIBILITY_THRESHOLD,
    ) -> None:
        if joint not in JOINT_LANDMARK_TRIPLETS:
            raise ValueError(
                f"Unknown joint '{joint}'. "
                f"Valid options: {list(JOINT_LANDMARK_TRIPLETS)}"
            )
        self.joint = joint
        self.frame_step = frame_step
        self.visibility_threshold = visibility_threshold

    def analyze(self, *, video_url: str) -> AnalysisResult:
        if not video_url.startswith(("http://", "https://", "file://")):
            raise ValueError("video_url must be an absolute HTTP(S) or file:// URL")

        video_path: str | None = None
        try:
            logger.info("MediaPipeAnalyzer: downloading video from %s", video_url)
            video_path = _download_video(video_url)

            logger.info(
                "MediaPipeAnalyzer: extracting frames (joint=%s, step=%d)",
                self.joint,
                self.frame_step,
            )
            angles, total_sampled, frames_with_landmarks = _extract_frame_angles(
                video_path,
                joint=self.joint,
                frame_step=self.frame_step,
                visibility_threshold=self.visibility_threshold,
            )

        finally:
            if video_path and os.path.exists(video_path):
                os.remove(video_path)

        if len(angles) < MIN_VALID_FRAMES:
            raise JointNotVisibleError(
                f"Only {len(angles)} valid frame(s) detected for joint '{self.joint}'. "
                "Ensure the joint is clearly visible in the video."
            )

        min_angle = round(min(angles), 2)
        max_angle = round(max(angles), 2)
        rom = max_angle - min_angle  # range of motion in degrees

        # Normalise ROM to 0–1 movement score.
        # A full 180° arc = perfect score 1.0; 0° = 0.0.
        movement_score = round(min(rom / 180.0, 1.0), 4)

        logger.info(
            "MediaPipeAnalyzer: done — min=%.1f° max=%.1f° score=%.3f frames=%d/%d",
            min_angle,
            max_angle,
            movement_score,
            frames_with_landmarks,
            total_sampled,
        )

        return AnalysisResult(
            min_angle=min_angle,
            max_angle=max_angle,
            movement_score=movement_score,
            raw_json={
                "model": "mediapipe_pose",
                "version": "0.10.21",
                "joint": self.joint,
                "frames_sampled": total_sampled,
                "frames_with_landmarks": frames_with_landmarks,
                "per_frame_angles": angles,
            },
        )


class LocalHeuristicAnalyzer:
    """
    Deterministic stub — returns fixed values.
    Use ONLY in unit tests or when MediaPipe is unavailable.
    """

    def analyze(self, *, video_url: str) -> AnalysisResult:
        if not video_url.startswith("http"):
            raise ValueError("Invalid video URL for analysis")

        return AnalysisResult(
            min_angle=22.5,
            max_angle=87.0,
            movement_score=0.82,
            raw_json={"model": "stub", "version": "v0"},
        )
