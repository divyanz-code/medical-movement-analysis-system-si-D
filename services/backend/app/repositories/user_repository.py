from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.models.user import User


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def find_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.session.scalar(stmt)

    def find_by_id(self, user_id: int) -> User | None:
        stmt = select(User).where(User.id == user_id)
        return self.session.scalar(stmt)

    def create_user(self, *, name: str, email: str, password_hash: str, role: str = 'patient') -> User:
        user = User(name=name, email=email, password_hash=password_hash, role=role)
        self.session.add(user)
        self.session.flush()

        profile = Profile(user_id=user.id)
        self.session.add(profile)
        self.session.commit()
        self.session.refresh(user)
        return user

    def upsert_profile(self, *, user: User, age: int, gender: str, affected_limb: str) -> User:
        if user.profile is None:
            user.profile = Profile(user_id=user.id)

        user.profile.age = age
        user.profile.gender = gender
        user.profile.affected_limb = affected_limb

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
