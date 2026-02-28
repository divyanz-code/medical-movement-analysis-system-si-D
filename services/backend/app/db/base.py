from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.models.base import Base


def build_engine(database_url: str):
    connect_args = {'check_same_thread': False} if database_url.startswith('sqlite') else {}
    return create_engine(database_url, echo=False, future=True, pool_pre_ping=True, connect_args=connect_args)


def build_session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)


def init_db(engine) -> None:
    Base.metadata.create_all(bind=engine)


def get_session(session_factory) -> Generator[Session, None, None]:
    session = session_factory()
    try:
        yield session
    finally:
        session.close()
