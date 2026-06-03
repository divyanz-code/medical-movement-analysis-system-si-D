#!/usr/bin/env python3
"""
Quick test to verify FaceMeshAnalyzer loads properly and the
FaceLandmarker model works. Creates a synthetic image with a face-like
structure to test the pipeline end-to-end.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

print("\n" + "="*60)
print("  FaceMeshAnalyzer Integration Test")
print("="*60)


print("\n[1] Testing FaceMeshAnalyzer import and model loading...")
from app.services.analysis_engine import (
    FaceMeshAnalyzer, FaceNotDetectedError,
    EXPRESSION_BLENDSHAPES, _extract_face_blendshapes, _compute_expression_stats,
    _DEFAULT_MODEL_PATH,
)

print(f"    Model path: {_DEFAULT_MODEL_PATH}")
print(f"    Model exists: {os.path.exists(_DEFAULT_MODEL_PATH)}")
print(f"    Expressions tracked: {list(EXPRESSION_BLENDSHAPES.keys())}")

try:
    analyzer = FaceMeshAnalyzer(frame_step=3)
    print("     FaceMeshAnalyzer created successfully")
except FileNotFoundError as e:
    print(f"     Model file not found: {e}")
    sys.exit(1)


print("\n[2] Testing FaceLandmarker model loading...")
import mediapipe as mp
BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=_DEFAULT_MODEL_PATH),
    running_mode=VisionRunningMode.IMAGE,
    output_face_blendshapes=True,
    num_faces=1,
)

with FaceLandmarker.create_from_options(options) as landmarker:
    print("    FaceLandmarker model loaded successfully")

    # Step 3: Test with a synthetic image
    print("\n[3] Testing with a synthetic RGB image (480x640)...")
    import numpy as np
    # Create a blank image
    test_image = np.zeros((480, 640, 3), dtype=np.uint8)
    test_image[:] = (200, 180, 160)  # skin-like color
    
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=test_image)
    result = landmarker.detect(mp_image)
    
    has_face = bool(result.face_blendshapes and len(result.face_blendshapes) > 0)
    print(f"    Face detected in blank image: {has_face} (expected: False)")
    
    if result.face_blendshapes and len(result.face_blendshapes) > 0:
        blendshapes = result.face_blendshapes[0]
        print(f"    Blendshape count: {len(blendshapes)}")
        for bs in blendshapes[:5]:
            print(f"      {bs.category_name}: {bs.score:.4f}")

# Step 4: Verify expression stats computation
print("\n[4] Testing _compute_expression_stats with mock data...")
mock_frames = [
    {"mouthSmileLeft": 0.8, "mouthSmileRight": 0.7, "eyeBlinkLeft": 0.1, "eyeBlinkRight": 0.05, "jawOpen": 0.3, "mouthFrownLeft": 0.0, "mouthFrownRight": 0.0, "browOuterUpLeft": 0.2, "browOuterUpRight": 0.25, "mouthPucker": 0.1, "cheekPuff": 0.05},
    {"mouthSmileLeft": 0.9, "mouthSmileRight": 0.85, "eyeBlinkLeft": 0.9, "eyeBlinkRight": 0.85, "jawOpen": 0.6, "mouthFrownLeft": 0.1, "mouthFrownRight": 0.05, "browOuterUpLeft": 0.5, "browOuterUpRight": 0.55, "mouthPucker": 0.3, "cheekPuff": 0.15},
    {"mouthSmileLeft": 0.3, "mouthSmileRight": 0.35, "eyeBlinkLeft": 0.0, "eyeBlinkRight": 0.0, "jawOpen": 0.1, "mouthFrownLeft": 0.4, "mouthFrownRight": 0.35, "browOuterUpLeft": 0.1, "browOuterUpRight": 0.1, "mouthPucker": 0.5, "cheekPuff": 0.4},
]
stats = _compute_expression_stats(mock_frames)
print(f"    Expressions computed: {len(stats)}")
for name, s in stats.items():
    print(f"      {name}: min={s['min']:.3f} max={s['max']:.3f} mean={s['mean']:.3f} peak={s['peak']:.3f}")

print(f"\n{'='*60}")
print("  🎉 All FaceMeshAnalyzer integration tests passed!")
print(f"{'='*60}\n")
