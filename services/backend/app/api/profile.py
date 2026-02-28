from fastapi import APIRouter

from app.api.deps import CurrentUserId, DbSession
from app.repositories.user_repository import UserRepository
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import ProfileService

router = APIRouter(prefix='/api/v1/profile', tags=['profile'])


def _to_profile_response(user) -> ProfileResponse:
    profile = user.profile
    return ProfileResponse(
        name=user.name,
        email=user.email,
        age=profile.age if profile else None,
        gender=profile.gender if profile else None,
        affected_limb=profile.affected_limb if profile else None,
    )


@router.get('', response_model=ProfileResponse)
def get_profile(user_id: CurrentUserId, db: DbSession) -> ProfileResponse:
    service = ProfileService(UserRepository(db))
    user = service.get_user(user_id)
    return _to_profile_response(user)


@router.put('', response_model=ProfileResponse)
def update_profile(payload: ProfileUpdateRequest, user_id: CurrentUserId, db: DbSession) -> ProfileResponse:
    service = ProfileService(UserRepository(db))
    user = service.update_profile(user_id, payload)
    return _to_profile_response(user)
