from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.core.errors import DomainError
from app.core.rate_limit import InMemoryRateLimiter
from app.core.security import TokenError, decode_access_token
from app.db.base import get_session
from app.services.storage_service import VideoStorage

bearer_scheme = HTTPBearer(auto_error=False)


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_db(request: Request):
    session_factory = request.app.state.session_factory
    yield from get_session(session_factory)


def get_video_storage(request: Request) -> VideoStorage:
    return request.app.state.video_storage


def get_rate_limiter(request: Request) -> InMemoryRateLimiter:
    return request.app.state.rate_limiter


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> int:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing bearer token')

    try:
        payload = decode_access_token(credentials.credentials, settings)
    except TokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    try:
        return int(payload['sub'])
    except (ValueError, TypeError, KeyError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token subject') from exc


DbSession = Annotated[Session, Depends(get_db)]
CurrentUserId = Annotated[int, Depends(get_current_user_id)]


def _client_key(request: Request, bucket: str) -> str:
    client_ip = request.client.host if request.client else 'unknown'
    return f'{bucket}:{client_ip}'


def rate_limit_auth(
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
    limiter: Annotated[InMemoryRateLimiter, Depends(get_rate_limiter)],
) -> None:
    result = limiter.allow(
        key=_client_key(request, 'auth'),
        limit=settings.auth_rate_limit_per_minute,
        window_seconds=60,
    )
    if not result.allowed:
        raise DomainError(
            status_code=429,
            code='RATE_LIMIT_EXCEEDED',
            message=f'Auth rate limit exceeded. Retry in {result.retry_after_seconds}s',
        )


def rate_limit_upload(
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
    limiter: Annotated[InMemoryRateLimiter, Depends(get_rate_limiter)],
) -> None:
    result = limiter.allow(
        key=_client_key(request, 'upload'),
        limit=settings.upload_rate_limit_per_minute,
        window_seconds=60,
    )
    if not result.allowed:
        raise DomainError(
            status_code=429,
            code='RATE_LIMIT_EXCEEDED',
            message=f'Upload rate limit exceeded. Retry in {result.retry_after_seconds}s',
        )
