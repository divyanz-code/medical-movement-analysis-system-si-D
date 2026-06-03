#!/usr/bin/env python3
"""
e2e_mediapipe_test.py
---------------------
In-process E2E test for the real MediaPipeAnalyzer.
Uses a real human MP4 pre-downloaded to /tmp/e2e_real_video.mp4.
Run: PYTHONPATH=. venv/bin/python e2e_mediapipe_test.py
"""

import json, os, subprocess, sys, tempfile, time

print("\n" + "="*60)
print("  MediaPipe E2E Test  (real human video)")
print("="*60)
LOCAL_VIDEO = "/tmp/e2e_real_video.mp4"
if not os.path.exists(LOCAL_VIDEO):
    print(f"\n[1] Downloading real video via curl...")
    r = subprocess.run([
        "curl", "-sL", "-o", LOCAL_VIDEO,
        "https://filesamples.com/samples/video/mp4/sample_640x360.mp4"
    ])
    if r.returncode != 0:
        print("    Download failed"); sys.exit(1)

size_mb = os.path.getsize(LOCAL_VIDEO) / (1024*1024)
print(f"\n[1] Video ready: {LOCAL_VIDEO}  ({size_mb:.2f} MB)")

print("\n[2] Booting FastAPI in-process (real MediaPipe, LocalFileStorage)...")
from fastapi import UploadFile
from fastapi.testclient import TestClient
from app.core.config import Settings
from app.main import create_app
from app.services.analysis_engine import MediaPipeAnalyzer
from app.services.storage_service import UploadResult

class LocalFileStorage:
    def __init__(self):
        self._dir = tempfile.mkdtemp(prefix="mma_e2e_")
    async def upload_video(self, *, file: UploadFile, folder: str) -> UploadResult:
        dest = os.path.join(self._dir, "video.mp4")
        open(dest, "wb").write(await file.read())
        return UploadResult(public_id="e2e/v", secure_url=f"file://{dest}")

db_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False); db_tmp.close()
settings = Settings(
    app_name="mma-e2e",
    database_url=f"sqlite+pysqlite:///{db_tmp.name}",
    jwt_secret="e2e-secret-value-1234567",
    max_video_size_mb=200, min_video_duration_seconds=1, max_video_duration_seconds=300,
    request_body_limit_mb=20, auth_rate_limit_per_minute=100, upload_rate_limit_per_minute=50,
    allowed_hosts=["testserver"], cors_origins=["http://localhost:3000"],
)
app = create_app(settings, video_storage=LocalFileStorage(),
                 analysis_engine=MediaPipeAnalyzer(joint="left_shoulder", frame_step=5, visibility_threshold=0.03))

with TestClient(app) as client:
    print("     App ready")

    # Register + login
    print("\n[3] Register + login...")
    r = client.post("/api/v1/auth/register",
                    json={"name":"E2E","email":"e2e@example.com","password":"TestPass123!"})
    assert r.status_code == 201, f"Register failed: {r.text}"
    r = client.post("/api/v1/auth/login",
                    json={"email":"e2e@example.com","password":"TestPass123!"})
    assert r.status_code == 200, f"Login failed: {r.text}"
    H = {"Authorization": f"Bearer {r.json()['access_token']}"}
    print("    Authenticated")

    # Upload
    print("\n[4] Uploading video...")
    with open(LOCAL_VIDEO, "rb") as vf:
        r = client.post("/api/v1/videos", headers=H,
                        files={"video": ("vid.mp4", vf, "video/mp4")},
                        data={"duration_seconds": "15"})
    assert r.status_code == 202, f"Upload failed: {r.text}"
    vid_id = r.json()["video_id"]
    print(f"     video_id={vid_id}  (MediaPipe running in background...)")

    # Poll
    print("\n[5] Polling — MediaPipe running pose detection frame by frame...\n")
    result = {}
    for elapsed in range(0, 180, 5):
        r = client.get(f"/api/v1/analysis/{vid_id}", headers=H)
        result = r.json(); status = result.get("status","?")
        print(f"    [{elapsed:>3}s]  {status}")
        if status == "SUCCEEDED": break
        if status == "FAILED":
            print(f"\n     FAILED  {result.get('error_code')}: {result.get('error_message')}")
            sys.exit(1)
        time.sleep(5)
    else:
        print("\n     Timed out"); sys.exit(1)

    # Results
    raw = json.loads(result.get("raw_json") or "{}")
    pf  = raw.get("per_frame_angles", [])
    print(f"\n{'='*60}")
    print("  🎉  Real MediaPipe Pose Results")
    print(f"{'='*60}")
    print(f"  min_angle         : {result['min_angle']}°")
    print(f"  max_angle         : {result['max_angle']}°")
    print(f"  ROM               : {round(result['max_angle']-result['min_angle'],2)}°")
    print(f"  movement_score    : {result['movement_score']}  (ROM ÷ 180°)")
    print(f"\n  model             : {raw.get('model')}")
    print(f"  version           : {raw.get('version')}")
    print(f"  joint             : {raw.get('joint')}")
    print(f"  frames_sampled    : {raw.get('frames_sampled')}")
    print(f"  frames_w/landmarks: {raw.get('frames_with_landmarks')}")
    if pf:
        print(f"  angle samples     : {pf[:10]} ...")
        print(f"  total angles      : {len(pf)}")
    print(f"{'='*60}\n")

os.unlink(db_tmp.name)
