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








JOINT_LANDMARK_TRIPLETS: dict[str, tuple[int, int, int]] = {
    "left_elbow":    (11, 13, 15),
    "right_elbow":   (12, 14, 16),
    "left_knee":     (23, 25, 27),
    "right_knee":    (24, 26, 28),
    "left_shoulder": (13, 11, 23),
    "right_shoulder":(14, 12, 24),
    "left_hip":      (11, 23, 25),
    "right_hip":     (12, 24, 26),
}

DEFAULT_JOINT = "left_elbow"
VISIBILITY_THRESHOLD = 0.5
FRAME_SAMPLE_STEP = 5
MIN_VALID_FRAMES = 2






class JointNotVisibleError(ValueError):
    """Exception raised when MediaPipe cannot find the target joint in enough frames."""
    pass


@dataclass
class AnalysisResult:
    min_angle: float
    max_angle: float
    movement_score: float
    raw_json: dict = field(default_factory=dict)






class MovementAnalyzer(Protocol):
    def analyze(self, *, video_url: str) -> AnalysisResult: ...






def _angle_between_three_points(
    ax: float, ay: float,
    bx: float, by: float,
    cx: float, cy: float,
) -> float:
    """
    Return the angle (in degrees) at point B formed by the vectors B→A and B→C.
    Uses the dot-product formula to avoid atan2 quadrant issues.
    """

    vba_x, vba_y = ax - bx, ay - by
    vbc_x, vbc_y = cx - bx, cy - by

    dot = vba_x * vbc_x + vba_y * vbc_y
    mag_a = math.hypot(vba_x, vba_y)
    mag_c = math.hypot(vbc_x, vbc_y)

    if mag_a < 1e-9 or mag_c < 1e-9:
        return 0.0

    cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))
    return math.degrees(math.acos(cos_angle))


def _download_video(url: str) -> str:
    """Download video from URL to a named temporary file. Returns the file path.

    Supports both http(s):// remote URLs and file:// local paths (useful for
    testing without Cloudinary).
    """

    if url.startswith("file://"):
        src_path = url[len("file://"):]
        suffix = os.path.splitext(src_path)[1] or ".mp4"
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        tmp.close()
        import shutil
        shutil.copy2(src_path, tmp.name)
        return tmp.name

    import requests

    suffix = ".mp4"

    path_part = url.split("?")[0]
    if "." in os.path.basename(path_part):
        suffix = "." + os.path.basename(path_part).rsplit(".", 1)[-1]

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        with requests.get(url, stream=True, timeout=30, allow_redirects=True) as resp:
            resp.raise_for_status()
            for chunk in resp.iter_content(chunk_size=1 << 16):
                tmp.write(chunk)
    finally:
        tmp.close()

    return tmp.name


HAND_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 4),
    (0, 5), (5, 6), (6, 7), (7, 8),
    (0, 9), (9, 10), (10, 11), (11, 12),
    (0, 13), (13, 14), (14, 15), (15, 16),
    (0, 17), (17, 18), (18, 19), (19, 20)
]


def _generate_ref_hand_landmarks(wx: float, wy: float, is_left: bool) -> list[tuple[float, float]]:
    """
    Generate 21 hand landmarks relative to the wrist coordinate.
    """
    import math

    landmarks = [(wx, wy)]
    

    base_angle = math.pi / 2.0
    


    if is_left:

        finger_angles = [-0.6, -0.2, 0.0, 0.2, 0.4]
    else:

        finger_angles = [0.6, 0.2, 0.0, -0.2, -0.4]
        

    for f_idx in range(5):
        angle = base_angle + finger_angles[f_idx]
        for joint_idx in range(1, 5):
            dist = 0.03 + joint_idx * 0.02
            lx = wx + math.cos(angle) * dist
            ly = wy + math.sin(angle) * dist
            landmarks.append((lx, ly))
            
    return landmarks


def _draw_skeleton(frame, pose_landmarks, left_hand_landmarks, right_hand_landmarks, color, thickness=3, alpha=1.0):
    import cv2
    h, w, _ = frame.shape
    

    draw_target = frame.copy() if alpha < 1.0 else frame
    
    pts = {}
    for idx, pt in pose_landmarks.items():
        if pt is not None:
            pts[idx] = (int(pt[0] * w), int(pt[1] * h))
            

    def draw_line(idx1, idx2):
        if idx1 in pts and idx2 in pts:
            cv2.line(draw_target, pts[idx1], pts[idx2], color, thickness)
            
    draw_line(11, 12)
    draw_line(11, 13)
    draw_line(13, 15)
    draw_line(12, 14)
    draw_line(14, 16)
    

    for idx, pt_pixel in pts.items():
        cv2.circle(draw_target, pt_pixel, thickness + 3, color, -1)
        

    def draw_hand(hand_lms):
        if not hand_lms:
            return
        hand_pts = [(int(pt[0] * w), int(pt[1] * h)) for pt in hand_lms]
        for start, end in HAND_CONNECTIONS:
            if start < len(hand_pts) and end < len(hand_pts):
                cv2.line(draw_target, hand_pts[start], hand_pts[end], color, max(1, thickness - 1))
        for pt_pixel in hand_pts:
            cv2.circle(draw_target, pt_pixel, max(2, thickness - 1), color, -1)
            
    draw_hand(left_hand_landmarks)
    draw_hand(right_hand_landmarks)
    
    if alpha < 1.0:
        cv2.addWeighted(draw_target, alpha, frame, 1.0 - alpha, 0, frame)


def _draw_hud(frame, status_text, feedback_text=None, alert_text=None, metrics=None, status_color=(255, 255, 255)):
    import cv2
    h, w, _ = frame.shape
    overlay = frame.copy()
    

    cv2.rectangle(overlay, (0, 0), (w, 100), (20, 20, 20), -1)
    

    if metrics:
        cv2.rectangle(overlay, (0, h - 80), (w, h), (20, 20, 20), -1)
        
    cv2.addWeighted(overlay, 0.65, frame, 0.35, 0, frame)
    
    font = cv2.FONT_HERSHEY_SIMPLEX
    

    cv2.putText(frame, status_text, (20, 35), font, 0.7, status_color, 2, cv2.LINE_AA)
    

    if feedback_text:
        cv2.putText(frame, f"Guidance: {feedback_text}", (20, 75), font, 0.55, (0, 255, 255), 1, cv2.LINE_AA)
        

    if alert_text:
        cv2.putText(frame, f"ALERT: {alert_text}", (20, 75), font, 0.55, (0, 0, 255), 2, cv2.LINE_AA)
        

    if metrics:
        metric_str = " | ".join([f"{k}: {v}" for k, v in metrics.items()])
        cv2.putText(frame, metric_str, (20, h - 35), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)


def _extract_frame_angles(
    video_path: str,
    joint: str,
    frame_step: int,
    visibility_threshold: float,
) -> tuple[list[float], int, int, bytes | None, bytes | None, bytes | None]:
    """
    Open *video_path* with OpenCV, run MediaPipe Pose & Hands on sampled frames,
    perform alignment/calibration state machine tracking, and return:
    (angles_list, total_sampled, frames_with_landmarks,
     calibration_frame_bytes, success_frame_bytes, tracking_frame_bytes)
    """
    import cv2
    import mediapipe as mp
    import numpy as np

    Pose = mp.solutions.pose.Pose
    Hands = mp.solutions.hands.Hands

    landmark_indices = JOINT_LANDMARK_TRIPLETS[joint]
    idx_a, idx_b, idx_c = landmark_indices

    angles: list[float] = []
    total_sampled = 0
    frames_with_landmarks = 0


    calibration_success = False
    consecutive_aligned_frames = 0
    calibrated_pose_center = None


    first_frame_processed_bytes = None
    calibration_frame_bytes = None
    success_frame_bytes = None
    tracking_frame_bytes = None
    max_tracking_confidence = -1.0


    ref_pose = {
        11: (0.60, 0.35),
        12: (0.40, 0.35),
        13: (0.65, 0.55),
        14: (0.35, 0.55),
        15: (0.70, 0.75),
        16: (0.30, 0.75),
    }
    ref_left_hand = _generate_ref_hand_landmarks(0.70, 0.75, is_left=True)
    ref_right_hand = _generate_ref_hand_landmarks(0.30, 0.75, is_left=False)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps <= 0:
        fps = 30.0
    sampled_fps = fps / frame_step
    calibration_frames_required = max(1, int(2.0 * sampled_fps))

    pose_analyzer = Pose(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    hands_analyzer = Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    try:
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

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pose_result = pose_analyzer.process(rgb_frame)
            hands_result = hands_analyzer.process(rgb_frame)


            lm = pose_result.pose_landmarks.landmark if pose_result.pose_landmarks else None
            

            pose_ok = lm is not None and all(
                lm[i].visibility >= visibility_threshold for i in [11, 12, 13, 14, 15, 16]
            )


            target_joint_visible = lm is not None and (
                lm[idx_a].visibility >= visibility_threshold and
                lm[idx_b].visibility >= visibility_threshold and
                lm[idx_c].visibility >= visibility_threshold
            )
            angle_val = 0.0
            if target_joint_visible:
                angle = _angle_between_three_points(
                    lm[idx_a].x, lm[idx_a].y,
                    lm[idx_b].x, lm[idx_b].y,
                    lm[idx_c].x, lm[idx_c].y,
                )
                angle_val = round(angle, 2)
                angles.append(angle_val)
                frames_with_landmarks += 1


            left_hand_lms = None
            right_hand_lms = None
            if hands_result.multi_hand_landmarks and hands_result.multi_handedness:
                for hand_lms, handedness in zip(hands_result.multi_hand_landmarks, hands_result.multi_handedness):
                    label = handedness.classification[0].label
                    lms_list = [(pt.x, pt.y) for pt in hand_lms.landmark]
                    if label == "Left":
                        left_hand_lms = lms_list
                    else:
                        right_hand_lms = lms_list

            hands_ok = left_hand_lms is not None and right_hand_lms is not None


            rendered_frame = frame.copy()

            if not first_frame_processed_bytes:

                ret_enc, enc_img = cv2.imencode('.png', frame)
                if ret_enc:
                    first_frame_processed_bytes = enc_img.tobytes()

            if not calibration_success:

                if not pose_ok:
                    feedback = "Align upper body in frame"
                elif not hands_ok:
                    feedback = "Show both hands in frame"
                else:

                    shoulder_center_x = (lm[11].x + lm[12].x) / 2.0
                    ref_center_x = 0.50
                    shoulder_dist = abs(lm[11].x - lm[12].x)
                    avg_elbow_y = (lm[13].y + lm[14].y) / 2.0

                    if shoulder_center_x - ref_center_x > 0.05:
                        feedback = "Move Left"
                    elif shoulder_center_x - ref_center_x < -0.05:
                        feedback = "Move Right"
                    elif shoulder_dist < 0.16:
                        feedback = "Move Forward"
                    elif shoulder_dist > 0.24:
                        feedback = "Move Backward"
                    elif avg_elbow_y > 0.61:
                        feedback = "Raise Arms"
                    elif avg_elbow_y < 0.49:
                        feedback = "Lower Arms"
                    else:
                        feedback = "Aligned! Hold Still..."

                if pose_ok and hands_ok and feedback == "Aligned! Hold Still...":
                    consecutive_aligned_frames += 1
                    if consecutive_aligned_frames >= calibration_frames_required:
                        calibration_success = True
                        calibrated_pose_center = (lm[11].x + lm[12].x) / 2.0
                else:
                    consecutive_aligned_frames = 0


                _draw_skeleton(
                    rendered_frame, ref_pose, ref_left_hand, ref_right_hand,
                    (0, 0, 255), thickness=3, alpha=0.4
                )


                actual_pose = {}
                if lm:
                    for i in [11, 12, 13, 14, 15, 16]:
                        if lm[i].visibility >= visibility_threshold:
                            actual_pose[i] = (lm[i].x, lm[i].y)
                _draw_skeleton(
                    rendered_frame, actual_pose, left_hand_lms, right_hand_lms,
                    (255, 255, 255), thickness=2, alpha=1.0
                )

                if calibration_success:

                    success_frame = frame.copy()
                    _draw_skeleton(
                        success_frame, ref_pose, ref_left_hand, ref_right_hand,
                        (0, 255, 0), thickness=3, alpha=0.5
                    )
                    _draw_hud(success_frame, "Status: Calibration Complete", status_color=(0, 255, 0))
                    ret_enc, enc_img = cv2.imencode('.png', success_frame)
                    if ret_enc:
                        success_frame_bytes = enc_img.tobytes()
                else:

                    _draw_hud(
                        rendered_frame, "Status: Calibrating",
                        feedback_text=feedback, status_color=(0, 0, 255)
                    )

                    if not calibration_frame_bytes and pose_ok:
                        ret_enc, enc_img = cv2.imencode('.png', rendered_frame)
                        if ret_enc:
                            calibration_frame_bytes = enc_img.tobytes()

            else:

                drift_alert = None
                if not pose_ok:
                    drift_alert = "Lost Tracking"
                else:
                    shoulder_center_x = (lm[11].x + lm[12].x) / 2.0
                    drift = abs(shoulder_center_x - calibrated_pose_center)
                    if drift > 0.08:
                        drift_alert = "Reposition Yourself"


                pass


                actual_pose = {}
                if lm:
                    for i in [11, 12, 13, 14, 15, 16]:
                        if lm[i].visibility >= visibility_threshold:
                            actual_pose[i] = (lm[i].x, lm[i].y)
                _draw_skeleton(
                    rendered_frame, actual_pose, left_hand_lms, right_hand_lms,
                    (235, 178, 78), thickness=3, alpha=1.0
                )


                if pose_ok and lm[idx_b].visibility >= visibility_threshold:
                    vx = int(lm[idx_b].x * rendered_frame.shape[1])
                    vy = int(lm[idx_b].y * rendered_frame.shape[0])
                    cv2.putText(
                        rendered_frame, f"{angle_val:.1f} deg", (vx + 15, vy - 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA
                    )


                if len(angles) >= 2:
                    angular_vel = abs(angles[-1] - angles[-2]) * sampled_fps
                    movement_status = "Active" if angular_vel > 15.0 else "Stable"
                else:
                    angular_vel = 0.0
                    movement_status = "Stable"


                avg_vis = sum(lm[i].visibility for i in [11, 12, 13, 14, 15, 16]) / 6.0 if pose_ok else 0.0
                metrics = {
                    "Confidence": f"{avg_vis:.2f}",
                    "Angle": f"{angle_val:.1f} deg" if pose_ok else "N/A",
                    "Velocity": f"{angular_vel:.1f} d/s" if pose_ok else "N/A",
                    "Motion": movement_status
                }

                _draw_hud(
                    rendered_frame, "Status: Tracking", alert_text=drift_alert,
                    metrics=metrics, status_color=(235, 178, 78)
                )


                if avg_vis > max_tracking_confidence:
                    max_tracking_confidence = avg_vis
                    ret_enc, enc_img = cv2.imencode('.png', rendered_frame)
                    if ret_enc:
                        tracking_frame_bytes = enc_img.tobytes()

    finally:
        pose_analyzer.close()
        hands_analyzer.close()
        cap.release()


    if not calibration_frame_bytes:
        calibration_frame_bytes = first_frame_processed_bytes
    if not success_frame_bytes:
        success_frame_bytes = calibration_frame_bytes or first_frame_processed_bytes
    if not tracking_frame_bytes:
        tracking_frame_bytes = success_frame_bytes or first_frame_processed_bytes

    return angles, total_sampled, frames_with_landmarks, calibration_frame_bytes, success_frame_bytes, tracking_frame_bytes






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
            (
                angles, total_sampled, frames_with_landmarks,
                calibration_bytes, success_bytes, tracking_bytes
            ) = _extract_frame_angles(
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
        rom = max_angle - min_angle



        movement_score = round(min(rom / 180.0, 1.0), 4)

        logger.info(
            "MediaPipeAnalyzer: done — min=%.1f° max=%.1f° score=%.3f frames=%d/%d",
            min_angle,
            max_angle,
            movement_score,
            frames_with_landmarks,
            total_sampled,
        )

        import base64
        calibration_frame_base64 = None
        success_frame_base64 = None
        tracking_frame_base64 = None
        if calibration_bytes is not None:
            calibration_frame_base64 = base64.b64encode(calibration_bytes).decode('utf-8')
        if success_bytes is not None:
            success_frame_base64 = base64.b64encode(success_bytes).decode('utf-8')
        if tracking_bytes is not None:
            tracking_frame_base64 = base64.b64encode(tracking_bytes).decode('utf-8')

        return AnalysisResult(
            min_angle=min_angle,
            max_angle=max_angle,
            movement_score=movement_score,
            raw_json={
                "model": "mediapipe_pose_and_hands",
                "version": "0.10.21",
                "joint": self.joint,
                "frames_sampled": total_sampled,
                "frames_with_landmarks": frames_with_landmarks,
                "landmark_image_base64": tracking_frame_base64 or calibration_frame_base64,
                "calibration_frame_base64": calibration_frame_base64,
                "success_frame_base64": success_frame_base64,
                "tracking_frame_base64": tracking_frame_base64,
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






class FaceNotDetectedError(ValueError):
    """Exception raised when MediaPipe cannot detect a face in enough frames."""
    pass




EXPRESSION_BLENDSHAPES: dict[str, list[str]] = {
    "smile": ["mouthSmileLeft", "mouthSmileRight"],
    "frown": ["mouthFrownLeft", "mouthFrownRight"],
    "eye_blink_left": ["eyeBlinkLeft"],
    "eye_blink_right": ["eyeBlinkRight"],
    "eyebrow_raise": ["browOuterUpLeft", "browOuterUpRight"],
    "mouth_open": ["jawOpen"],
    "lip_pucker": ["mouthPucker"],
    "cheek_puff": ["cheekPuff"],
}


MIN_FACE_FRAMES = 2


_DEFAULT_MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")
_DEFAULT_MODEL_PATH = os.path.join(_DEFAULT_MODEL_DIR, "face_landmarker.task")


def _extract_face_blendshapes(
    video_path: str,
    frame_step: int,
    model_path: str,
) -> tuple[list[dict[str, float]], int, int, bytes | None]:
    """
    Open *video_path* with OpenCV, run MediaPipe FaceLandmarker on sampled
    frames, draw 478 landmarks on the frame with the highest expression score,
    and return (per_frame_blendshapes, total_frames_sampled, frames_with_face, landmark_image_bytes).

                    Each entry in per_frame_blendshapes is a dict mapping blendshape
    category name → score (0.0–1.0).
    """
    import cv2
    from mediapipe import Image, ImageFormat
    from mediapipe.tasks.python import BaseOptions
    from mediapipe.tasks.python.vision import FaceLandmarker, FaceLandmarkerOptions
    from mediapipe.tasks.python.vision.core.vision_task_running_mode import VisionTaskRunningMode as VisionRunningMode
    from mediapipe.python.solutions.face_mesh_connections import FACEMESH_TESSELATION

    options = FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        running_mode=VisionRunningMode.IMAGE,
        output_face_blendshapes=True,
        num_faces=1,
    )

    per_frame: list[dict[str, float]] = []
    total_sampled = 0
    frames_with_face = 0

    best_frame: cv2.Mat | None = None
    best_landmarks = None
    max_expression_score = -1.0

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video file: {video_path}")

    try:
        with FaceLandmarker.create_from_options(options) as landmarker:
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


                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = Image(
                    image_format=ImageFormat.SRGB,
                    data=rgb_frame,
                )
                result = landmarker.detect(mp_image)

                if not result.face_blendshapes or len(result.face_blendshapes) == 0:
                    continue

                frames_with_face += 1


                frame_scores: dict[str, float] = {}
                for bs in result.face_blendshapes[0]:
                    frame_scores[bs.category_name] = round(bs.score, 4)

                per_frame.append(frame_scores)



                if frame_scores:
                    expr_score = sum(frame_scores.values()) / len(frame_scores)
                    if expr_score > max_expression_score:
                        max_expression_score = expr_score
                        best_frame = frame.copy()
                        if result.face_landmarks and len(result.face_landmarks) > 0:
                            best_landmarks = result.face_landmarks[0]
    finally:
        cap.release()


    landmark_image_bytes: bytes | None = None
    if best_frame is not None and best_landmarks is not None:
        h, w, _ = best_frame.shape


        connections = FACEMESH_TESSELATION
        for start_idx, end_idx in connections:
            if start_idx < len(best_landmarks) and end_idx < len(best_landmarks):
                pt1 = best_landmarks[start_idx]
                pt2 = best_landmarks[end_idx]
                x1, y1 = int(pt1.x * w), int(pt1.y * h)
                x2, y2 = int(pt2.x * w), int(pt2.y * h)
                cv2.line(best_frame, (x1, y1), (x2, y2), (0, 200, 0), 1)


        for idx, lm in enumerate(best_landmarks):
            cx = int(lm.x * w)
            cy = int(lm.y * h)

            cv2.circle(best_frame, (cx, cy), 1, (255, 0, 0), -1)


            cv2.putText(
                best_frame,
                str(idx),
                (cx + 2, cy + 2),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.20,
                (255, 50, 50),
                1,
            )

        ret, encoded_img = cv2.imencode('.png', best_frame)
        if ret:
            landmark_image_bytes = encoded_img.tobytes()

    return per_frame, total_sampled, frames_with_face, landmark_image_bytes


def _compute_expression_stats(
    per_frame: list[dict[str, float]],
) -> dict[str, dict[str, float]]:
    """
    Given per-frame blendshape data, compute min/max/mean/peak for each
    named expression in EXPRESSION_BLENDSHAPES.
    """
    stats: dict[str, dict[str, float]] = {}
    for expr_name, bs_names in EXPRESSION_BLENDSHAPES.items():

        values: list[float] = []
        for frame_scores in per_frame:
            scores = [frame_scores.get(bs, 0.0) for bs in bs_names]
            avg = sum(scores) / len(scores) if scores else 0.0
            values.append(avg)

        if not values:
            stats[expr_name] = {"min": 0.0, "max": 0.0, "mean": 0.0, "peak": 0.0}
            continue

        stats[expr_name] = {
            "min": round(min(values), 4),
            "max": round(max(values), 4),
            "mean": round(sum(values) / len(values), 4),
            "peak": round(max(values), 4),
        }
    return stats


class FaceMeshAnalyzer:
    """
    Facial expression analyzer — downloads the video, runs MediaPipe
    FaceLandmarker frame-by-frame, extracts blendshape scores, and
    returns statistical summary of detected expressions.

    Parameters
    ----------
    frame_step : int
        Sample every Nth frame. Higher = faster but less precise.
    model_path : str | None
        Path to the face_landmarker.task model file. If None, uses the
        default location in services/backend/models/.
    """

    def __init__(
        self,
        frame_step: int = FRAME_SAMPLE_STEP,
        model_path: str | None = None,
    ) -> None:
        self.frame_step = frame_step
        self.model_path = model_path or _DEFAULT_MODEL_PATH
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"FaceLandmarker model not found at '{self.model_path}'. "
                "Download it from: https://storage.googleapis.com/mediapipe-models/"
                "face_landmarker/face_landmarker/float16/1/face_landmarker.task"
            )

    def analyze(self, *, video_url: str) -> AnalysisResult:
        if not video_url.startswith(("http://", "https://", "file://")):
            raise ValueError("video_url must be an absolute HTTP(S) or file:// URL")

        video_path: str | None = None
        try:
            logger.info("FaceMeshAnalyzer: downloading video from %s", video_url)
            video_path = _download_video(video_url)

            logger.info(
                "FaceMeshAnalyzer: extracting blendshapes (step=%d)",
                self.frame_step,
            )
            per_frame, total_sampled, frames_with_face, landmark_image_bytes = _extract_face_blendshapes(
                video_path,
                frame_step=self.frame_step,
                model_path=self.model_path,
            )
        finally:
            if video_path and os.path.exists(video_path):
                os.remove(video_path)

        if len(per_frame) < MIN_FACE_FRAMES:
            raise FaceNotDetectedError(
                f"Only {len(per_frame)} frame(s) with a detected face. "
                "Ensure your face is clearly visible in the video."
            )


        expression_stats = _compute_expression_stats(per_frame)


        peaks = [s["peak"] for s in expression_stats.values()]
        overall_intensity = round(sum(peaks) / len(peaks), 4) if peaks else 0.0





        frame_intensities = []
        for frame_scores in per_frame:

            all_scores = list(frame_scores.values())
            avg = sum(all_scores) / len(all_scores) if all_scores else 0.0
            frame_intensities.append(avg)

        min_intensity = round(min(frame_intensities), 4) if frame_intensities else 0.0
        max_intensity = round(max(frame_intensities), 4) if frame_intensities else 0.0

        logger.info(
            "FaceMeshAnalyzer: done — intensity=%.3f frames=%d/%d",
            overall_intensity,
            frames_with_face,
            total_sampled,
        )

        import base64
        landmark_image_base64 = None
        if landmark_image_bytes is not None:
            landmark_image_base64 = base64.b64encode(landmark_image_bytes).decode('utf-8')

        return AnalysisResult(
            min_angle=min_intensity,
            max_angle=max_intensity,
            movement_score=overall_intensity,
            raw_json={
                "model": "mediapipe_face_mesh",
                "version": "0.10.18",
                "analysis_type": "facial_expression",
                "frames_sampled": total_sampled,
                "frames_with_face": frames_with_face,
                "expression_summary": expression_stats,
                "landmark_image_base64": landmark_image_base64,
                "per_frame_blendshapes": [
                    {k: v for k, v in fs.items()
                     if any(k in bs_list for bs_list in EXPRESSION_BLENDSHAPES.values())}
                    for fs in per_frame
                ],
            },
        )
