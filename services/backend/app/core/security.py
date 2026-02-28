from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import Settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


class TokenError(Exception):
    pass


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(*, subject: str, settings: Settings, extra_claims: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.jwt_access_token_exp_minutes)

    payload: dict[str, Any] = {
        'sub': subject,
        'iat': int(now.timestamp()),
        'exp': int(expire.timestamp()),
    }
    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str, settings: Settings) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise TokenError('Invalid or expired token') from exc

    if 'sub' not in payload:
        raise TokenError('Token missing subject')

    return payload
