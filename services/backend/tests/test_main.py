from io import BytesIO
from pathlib import Path

from fastapi import UploadFile
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from app.services.storage_service import UploadResult


class FakeVideoStorage:
    def __init__(self) -> None:
        self._counter = 0

    async def upload_video(self, *, file: UploadFile, folder: str) -> UploadResult:
        self._counter += 1
        return UploadResult(
            public_id=f'{folder}/video_{self._counter}',
            secure_url=f'https://cdn.example.com/video_{self._counter}.mp4',
        )


def build_client(tmp_path: Path, *, max_video_size_mb: int = 50) -> TestClient:
    db_file = tmp_path / 'test_phase.db'
    settings = Settings(
        app_name='mma-backend-test',
        app_version='0.3.0-test',
        environment='test',
        database_url=f'sqlite+pysqlite:///{db_file}',
        jwt_secret='test-secret-value-1234',
        jwt_access_token_exp_minutes=60,
        max_video_size_mb=max_video_size_mb,
        cloudinary_folder='mma/test-videos',
    )
    app = create_app(settings, video_storage=FakeVideoStorage())
    return TestClient(app)


def auth_headers(token: str) -> dict[str, str]:
    return {'Authorization': f'Bearer {token}'}


def register_and_login(client: TestClient, email: str) -> str:
    register_response = client.post(
        '/api/v1/auth/register',
        json={
            'name': 'Shaurya Bansal',
            'email': email,
            'password': 'StrongP@ssw0rd!',
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        '/api/v1/auth/login',
        json={'email': email, 'password': 'StrongP@ssw0rd!'},
    )
    assert login_response.status_code == 200
    return login_response.json()['access_token']


def test_health(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json() == {'status': 'ok'}


def test_analyze_rejects_invalid_url(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        response = client.post('/analyze', json={'video_url': 'local-file'})
        assert response.status_code == 400
        assert response.json()['error']['code'] == 'HTTP_ERROR'


def test_auth_register_and_login_success(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token = register_and_login(client, 'shaurya@example.com')
        assert isinstance(token, str)


def test_auth_rejects_duplicate_email(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        payload = {
            'name': 'Shaurya Bansal',
            'email': 'shaurya@example.com',
            'password': 'StrongP@ssw0rd!',
        }
        first = client.post('/api/v1/auth/register', json=payload)
        second = client.post('/api/v1/auth/register', json=payload)

        assert first.status_code == 201
        assert second.status_code == 409
        assert second.json()['error']['code'] == 'EMAIL_IN_USE'


def test_auth_rejects_invalid_credentials(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        register_and_login(client, 'shaurya@example.com')

        invalid = client.post(
            '/api/v1/auth/login',
            json={'email': 'shaurya@example.com', 'password': 'wrong-password'},
        )
        assert invalid.status_code == 401
        assert invalid.json()['error']['code'] == 'INVALID_CREDENTIALS'


def test_profile_requires_auth(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        response = client.get('/api/v1/profile')
        assert response.status_code == 401
        assert response.json()['error']['code'] == 'HTTP_ERROR'


def test_profile_update_and_fetch(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token = register_and_login(client, 'shaurya@example.com')

        update = client.put(
            '/api/v1/profile',
            headers=auth_headers(token),
            json={'age': 27, 'gender': 'male', 'affected_limb': 'right_knee'},
        )
        assert update.status_code == 200

        fetched = client.get('/api/v1/profile', headers=auth_headers(token))
        assert fetched.status_code == 200
        assert fetched.json()['affected_limb'] == 'right_knee'


def test_video_upload_success(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token = register_and_login(client, 'uploader@example.com')

        response = client.post(
            '/api/v1/videos',
            headers=auth_headers(token),
            files={'video': ('knee.mp4', BytesIO(b'video-bytes'), 'video/mp4')},
            data={'duration_seconds': '10'},
        )

        assert response.status_code == 202
        payload = response.json()
        assert payload['status'] == 'PENDING'

        video_id = payload['video_id']
        get_response = client.get(f'/api/v1/videos/{video_id}', headers=auth_headers(token))
        assert get_response.status_code == 200
        assert get_response.json()['content_type'] == 'video/mp4'


def test_video_rejects_unsupported_mime(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token = register_and_login(client, 'mime@example.com')

        response = client.post(
            '/api/v1/videos',
            headers=auth_headers(token),
            files={'video': ('notes.txt', BytesIO(b'abc'), 'text/plain')},
            data={'duration_seconds': '10'},
        )

        assert response.status_code == 415
        assert response.json()['error']['code'] == 'UNSUPPORTED_MEDIA_TYPE'


def test_video_rejects_large_file(tmp_path: Path) -> None:
    with build_client(tmp_path, max_video_size_mb=1) as client:
        token = register_and_login(client, 'size@example.com')
        too_large = BytesIO(b'x' * (1024 * 1024 + 1))

        response = client.post(
            '/api/v1/videos',
            headers=auth_headers(token),
            files={'video': ('big.mp4', too_large, 'video/mp4')},
            data={'duration_seconds': '10'},
        )

        assert response.status_code == 413
        assert response.json()['error']['code'] == 'FILE_TOO_LARGE'


def test_video_access_forbidden_for_other_user(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token_user_1 = register_and_login(client, 'owner@example.com')
        token_user_2 = register_and_login(client, 'other@example.com')

        upload = client.post(
            '/api/v1/videos',
            headers=auth_headers(token_user_1),
            files={'video': ('knee.mp4', BytesIO(b'video-bytes'), 'video/mp4')},
            data={'duration_seconds': '10'},
        )
        assert upload.status_code == 202

        video_id = upload.json()['video_id']
        forbidden = client.get(f'/api/v1/videos/{video_id}', headers=auth_headers(token_user_2))

        assert forbidden.status_code == 403
        assert forbidden.json()['error']['code'] == 'FORBIDDEN_RESOURCE'


def test_video_multiple_uploads_same_user(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        token = register_and_login(client, 'repeat@example.com')

        created_ids: list[int] = []
        for _ in range(3):
            response = client.post(
                '/api/v1/videos',
                headers=auth_headers(token),
                files={'video': ('knee.mp4', BytesIO(b'video-bytes'), 'video/mp4')},
                data={'duration_seconds': '10'},
            )
            assert response.status_code == 202
            created_ids.append(response.json()['video_id'])

        assert len(created_ids) == 3
        assert len(set(created_ids)) == 3
