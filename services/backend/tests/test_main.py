from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


def build_client(tmp_path: Path) -> TestClient:
    db_file = tmp_path / 'test_phase2.db'
    settings = Settings(
        app_name='mma-backend-test',
        app_version='0.2.0-test',
        environment='test',
        database_url=f'sqlite+pysqlite:///{db_file}',
        jwt_secret='test-secret-value-1234',
        jwt_access_token_exp_minutes=60,
    )
    app = create_app(settings)
    return TestClient(app)


def auth_headers(token: str) -> dict[str, str]:
    return {'Authorization': f'Bearer {token}'}


def test_health(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json() == {'status': 'ok'}


def test_analyze_rejects_invalid_url(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        response = client.post('/analyze', json={'video_url': 'local-file'})
        assert response.status_code == 400
        payload = response.json()
        assert payload['error']['code'] == 'HTTP_ERROR'


def test_auth_register_and_login_success(tmp_path: Path) -> None:
    with build_client(tmp_path) as client:
        register_payload = {
            'name': 'Shaurya Bansal',
            'email': 'shaurya@example.com',
            'password': 'StrongP@ssw0rd!',
        }
        register_response = client.post('/api/v1/auth/register', json=register_payload)
        assert register_response.status_code == 201
        assert register_response.json()['user']['email'] == 'shaurya@example.com'

        login_response = client.post(
            '/api/v1/auth/login',
            json={'email': 'shaurya@example.com', 'password': 'StrongP@ssw0rd!'},
        )
        assert login_response.status_code == 200
        token_payload = login_response.json()
        assert token_payload['token_type'] == 'bearer'
        assert isinstance(token_payload['access_token'], str)


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
        client.post(
            '/api/v1/auth/register',
            json={
                'name': 'Shaurya Bansal',
                'email': 'shaurya@example.com',
                'password': 'StrongP@ssw0rd!',
            },
        )

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
        register_response = client.post(
            '/api/v1/auth/register',
            json={
                'name': 'Shaurya Bansal',
                'email': 'shaurya@example.com',
                'password': 'StrongP@ssw0rd!',
            },
        )
        assert register_response.status_code == 201

        login_response = client.post(
            '/api/v1/auth/login',
            json={'email': 'shaurya@example.com', 'password': 'StrongP@ssw0rd!'},
        )
        token = login_response.json()['access_token']

        update = client.put(
            '/api/v1/profile',
            headers=auth_headers(token),
            json={'age': 27, 'gender': 'male', 'affected_limb': 'right_knee'},
        )
        assert update.status_code == 200
        assert update.json()['age'] == 27

        fetched = client.get('/api/v1/profile', headers=auth_headers(token))
        assert fetched.status_code == 200
        payload = fetched.json()
        assert payload['name'] == 'Shaurya Bansal'
        assert payload['email'] == 'shaurya@example.com'
        assert payload['affected_limb'] == 'right_knee'
