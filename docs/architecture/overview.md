# Architecture Overview (Phase 1 Baseline)

## Scope

Phase 1 MVP baseline structure established.

## Monorepo Layout

- `apps/mobile`: React Native + Expo app.
- `services/backend`: Python/FastAPI API service (auth, profile, upload, analysis, history).
- `infra`: Infrastructure assets (containers, compose, deployment manifests).
- `docs`: Architecture, phase checkpoints, APIs, security, operations, and release documentation.

## Status

- Phase 1.1 (repository and workspace bootstrap): Completed on 2026-02-28.
- Phase 1.2 (tooling and quality baseline): Completed on 2026-02-28, then refactored to single-backend architecture on 2026-02-28.

## Tooling Baseline

- Root npm workspace for `apps/mobile`.
- Strict TypeScript enabled in mobile.
- Linting and formatting:
  - ESLint (flat config)
  - Prettier
- Tests:
  - Mobile: Vitest
  - Backend (FastAPI): Pytest + FastAPI `TestClient`
