import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.api import analysis, analyze, auth, profile, videos
from app.core.config import Settings, get_settings
from app.core.errors import DomainError
from app.db.base import build_engine, build_session_factory, init_db
from app.services.analysis_engine import LocalHeuristicAnalyzer, MovementAnalyzer
from app.services.storage_service import CloudinaryVideoStorage, VideoStorage
import app.models  # noqa: F401


def create_app(
    settings: Settings | None = None,
    video_storage: VideoStorage | None = None,
    analysis_engine: MovementAnalyzer | None = None,
) -> FastAPI:
    resolved_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        engine = build_engine(resolved_settings.database_url)
        session_factory = build_session_factory(engine)
        init_db(engine)
        storage = video_storage or CloudinaryVideoStorage(resolved_settings)
        analyzer = analysis_engine or LocalHeuristicAnalyzer()

        app.state.settings = resolved_settings
        app.state.engine = engine
        app.state.session_factory = session_factory
        app.state.video_storage = storage
        app.state.analysis_engine = analyzer
        yield
        engine.dispose()

    app = FastAPI(title=resolved_settings.app_name, version=resolved_settings.app_version, lifespan=lifespan)

    @app.middleware('http')
    async def request_context_middleware(request: Request, call_next):
        request_id = request.headers.get('x-request-id') or uuid.uuid4().hex
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers['x-request-id'] = request_id
        return response

    @app.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                'error': {
                    'code': exc.code,
                    'message': exc.message,
                    'request_id': request.state.request_id,
                }
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        message = exc.detail if isinstance(exc.detail, str) else 'Request failed'
        return JSONResponse(
            status_code=exc.status_code,
            content={
                'error': {
                    'code': 'HTTP_ERROR',
                    'message': message,
                    'request_id': request.state.request_id,
                }
            },
        )

    @app.get('/health')
    def health() -> dict[str, str]:
        return {'status': 'ok'}

    app.include_router(auth.router)
    app.include_router(profile.router)
    app.include_router(videos.router)
    app.include_router(analysis.router)
    app.include_router(analyze.router)

    return app


app = create_app()
