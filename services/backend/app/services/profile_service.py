from app.core.errors import DomainError
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.profile import ProfileUpdateRequest


class ProfileService:
    def __init__(self, repo: UserRepository) -> None:
        self.repo = repo

    def get_user(self, user_id: int) -> User:
        user = self.repo.find_by_id(user_id)
        if user is None:
            raise DomainError(status_code=401, code='INVALID_TOKEN', message='User not found for token')
        return user

    def update_profile(self, user_id: int, payload: ProfileUpdateRequest) -> User:
        user = self.get_user(user_id)
        return self.repo.upsert_profile(
            user=user,
            age=payload.age,
            gender=payload.gender,
            affected_limb=payload.affected_limb,
        )
