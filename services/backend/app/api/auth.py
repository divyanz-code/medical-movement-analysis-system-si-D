from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import DbSession, get_settings
from app.core.config import Settings
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix='/api/v1/auth', tags=['auth'])


@router.post('/register', response_model=RegisterResponse, status_code=201)
def register(
    payload: RegisterRequest,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> RegisterResponse:
    service = AuthService(UserRepository(db), settings)
    user = service.register(payload)
    return RegisterResponse(user=UserResponse.model_validate(user))


@router.post('/login', response_model=LoginResponse)
def login(
    payload: LoginRequest,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> LoginResponse:
    service = AuthService(UserRepository(db), settings)
    return service.login(payload.email, payload.password)
