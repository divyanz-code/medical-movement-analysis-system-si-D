from app.core.config import Settings
from app.core.errors import DomainError
from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginResponse, RegisterRequest


class AuthService:
    def __init__(self, repo: UserRepository, settings: Settings) -> None:
        self.repo = repo
        self.settings = settings

    def register(self, payload: RegisterRequest):
        existing = self.repo.find_by_email(payload.email.lower())
        if existing is not None:
            raise DomainError(status_code=409, code='EMAIL_IN_USE', message='Email already registered')

        return self.repo.create_user(
            name=payload.name.strip(),
            email=payload.email.lower(),
            password_hash=hash_password(payload.password),
        )

    def login(self, email: str, password: str) -> LoginResponse:
        user = self.repo.find_by_email(email.lower())
        if user is None or not verify_password(password, user.password_hash):
            raise DomainError(status_code=401, code='INVALID_CREDENTIALS', message='Invalid email or password')

        token = create_access_token(
            subject=str(user.id),
            settings=self.settings,
            extra_claims={'email': user.email, 'role': user.role},
        )
        return LoginResponse(access_token=token, expires_in=self.settings.jwt_access_token_exp_minutes * 60)
