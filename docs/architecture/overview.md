# Architecture Overview (Phase 1 Baseline)

## Scope

Phase 1 MVP baseline structure established.

## Monorepo Layout

- `apps/mobile`: React Native + Expo app.
- `apps/backend`: Node.js/Express API.
- `services/ai`: Python/FastAPI movement analysis service.
- `infra`: Infrastructure assets (containers, compose, deployment manifests).
- `docs`: Architecture, phase checkpoints, APIs, security, operations, and release documentation.

## Status

- Phase 1.1 (repository and workspace bootstrap): Completed on 2026-02-28.
- Phase 1.2 (tooling and quality baseline): Completed on 2026-02-28.

## Tooling Baseline

- Root npm workspaces for `apps/backend` and `apps/mobile`.
- Strict TypeScript enabled in backend and mobile.
- Linting and formatting:
  - ESLint (flat config)
  - Prettier
- Tests:
  - Backend: Vitest + Supertest
  - Mobile: Vitest
  - AI service: Pytest + FastAPI `TestClient`
