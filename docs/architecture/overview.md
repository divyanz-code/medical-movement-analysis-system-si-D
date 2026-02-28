# Architecture Overview

## Scope

Phase 1 MVP baseline structure established.

## Monorepo Layout

- `apps/mobile`: React Native + Expo app.
- `services/backend`: Python/FastAPI API service (auth, profile, upload, analysis, history).
- `infra`: Docker Compose stack for backend + PostgreSQL.
- `docs`: Architecture, phase checkpoints, APIs, security, operations, and release documentation.

## Status

- Phase 1.1 (repository and workspace bootstrap): Completed on 2026-02-28.
- Phase 1.2 (tooling and quality baseline): Completed on 2026-02-28, then refactored to single-backend architecture on 2026-02-28.
- Phase 1.3 (architecture artifacts): Completed on 2026-02-28.
- Phase 2 (auth and profile domain): Completed on 2026-02-28.
- Phase 3 (video ingestion and cloud storage): Completed on 2026-02-28.
- Phase 4 (analysis orchestration): Completed on 2026-02-28.
- Phase 5 (mobile MVP flow orchestration): Completed on 2026-02-28.

## Tooling Baseline

- Root npm workspace for `apps/mobile`.
- Strict TypeScript enabled in mobile.
- Linting and formatting:
  - ESLint (flat config)
  - Prettier
- Tests:
  - Mobile: Vitest
  - Backend (FastAPI): Pytest + FastAPI `TestClient`
- Container baseline:
  - `services/backend/Dockerfile`
  - `infra/docker-compose.yml`

## Phase 1.3 Artifacts

- API contract draft: `docs/api/api-contract-v1.md`
- Sequence diagram: `docs/architecture/upload-analysis-sequence.md`
- Risk register: `docs/architecture/risk-register.md`
