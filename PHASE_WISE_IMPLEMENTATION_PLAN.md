# Medical Movement Analysis System - Phase-Wise Implementation Plan

Date: 2026-02-28  
Input baseline: [`SRD.md`](/Users/shauryaagrawal/Desktop/CVProject/SRD.md) (v1.0, dated 2026-02-28)

## 1. Baseline Review (Updated)

- Local codebase reviewed.
- Architecture decision updated for MVP simplicity:
  - Single backend server in Python/FastAPI.
  - One frontend (React Native + Expo).
  - Dockerized backend + PostgreSQL.
- Node/Express backend scaffold removed.

## 2. Research-Driven Decisions (Current Official Docs)

1. Use one FastAPI backend for auth, profile, upload, analysis orchestration, and history.
Reason: reduces operational complexity for MVP while keeping typed API contracts via Pydantic.
2. Use `UploadFile` for streaming uploads and enforce payload limits in backend/proxy.
Reason: FastAPI docs support efficient file handling for multipart uploads.
3. Keep explicit error contracts via `HTTPException` and typed responses.
Reason: FastAPI error-handling guidance supports predictable API behavior.
4. Use strict CORS allowlist and avoid wildcard with credentials.
Reason: FastAPI CORS guidance for auth-bearing requests.
5. Use server-side signed Cloudinary uploads.
Reason: Cloudinary docs position signed uploads for secure production usage.
6. Use PostgreSQL constraints for integrity and unique email guarantees.
Reason: PostgreSQL docs confirm `UNIQUE` and FK constraints for domain safety.
7. Use JWT auth and strong password hashing.
Reason: aligns with SRD and OWASP password-storage guidance.
8. Keep Docker images minimal and deterministic.
Reason: Docker best-practice docs recommend pinned/minimal multi-stage builds.

## 3. Architecture Blueprint (Phase 1 MVP)

### 3.1 Services

- Mobile app: React Native + Expo.
- Backend API: Python + FastAPI.
- Database: PostgreSQL.
- Object storage: Cloudinary.

### 3.2 Core Backend API Surface (v1)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/profile`
- `PUT /api/v1/profile`
- `POST /api/v1/videos` (multipart, max 50 MB)
- `GET /api/v1/analysis/{video_id}`
- `GET /api/v1/analysis/history`

### 3.3 Data Model (MVP + reliability fields)

- `users(id, name, email UNIQUE, password_hash, role, created_at, updated_at)`
- `profiles(id, user_id UNIQUE FK, age, gender, affected_limb, updated_at)`
- `videos(id, user_id FK, cloud_url, cloud_public_id, duration_seconds, created_at)`
- `analysis(id, video_id UNIQUE FK, status, min_angle, max_angle, movement_score, raw_json, error_code, error_message, created_at, updated_at)`

Status enum proposal:
- `PENDING`, `PROCESSING`, `SUCCEEDED`, `FAILED`

### 3.4 Cross-Cutting Engineering Standards

- Typed request/response contracts and validation at all boundaries.
- Separation of concerns:
  - API routers -> services -> repositories -> integrations.
- Config via environment variables with strict startup validation.
- Structured logging with request correlation IDs.
- Secure-by-default:
  - TLS outside local dev.
  - JWT auth on protected routes.
  - Password hashing with bcrypt-compatible strategy.
  - Explicit CORS origin allowlist.
  - Authorization checks for user-owned resources.

## 4. Phase Gate Rules (Mandatory)

1. A phase cannot start until previous checkpoint is `PASS`.
2. Every checkpoint must include a doc update before sign-off.
3. If any acceptance test fails, phase status is `BLOCKED`.
4. If uncertainty remains, add tradeoff notes and resolve before progression.
5. No production deploy until all Phase 1 acceptance criteria are traceably passed.

## 5. Phase Plan (With Subphases and Checkpoints)

## Phase 1 - Foundation and Governance

### 1.1 Repository and workspace bootstrap

- Monorepo layout:
  - `apps/mobile`
  - `services/backend`
  - `infra`
  - `docs`

### 1.2 Tooling and quality baseline

- Mobile TypeScript strict mode.
- Backend pytest and FastAPI test harness.
- Lint/format/typecheck/test scripts wired at root.

### 1.3 Architecture artifacts

- API contract draft.
- Sequence diagram for upload -> analysis -> result.
- Risk register (security/performance/reliability).

### Checkpoint CP-1 (Gate)

- Required pass:
  - Local CI scripts run green.
  - Repo structure created.
  - Architecture docs reviewed.
- Required docs update:
  - `docs/phases/phase-1-checkpoint.md`
  - `docs/architecture/overview.md`

## Phase 2 - Identity, Auth, and Profile Domain (FastAPI)

### 2.1 Schema and migrations

- Create `users` and `profiles`.
- Enforce unique email and FK ownership.

### 2.2 Auth APIs

- Register/login endpoints.
- Password hashing and JWT issuance.

### 2.3 Profile APIs

- Get/update profile.
- Validation for age/gender/affected limb.

### 2.4 Tests

- Unit tests for validation and services.
- API integration tests for auth/profile routes.
- Negative-path tests.

### Checkpoint CP-2 (Gate)

- Required pass:
  - Auth + profile suites green.
  - Security checks pass.
- Required docs update:
  - `docs/phases/phase-2-checkpoint.md`
  - `docs/api/auth-profile.md`
  - `docs/security/auth-model.md`

## Phase 3 - Video Ingestion and Cloud Storage

### 3.1 Upload endpoint and validation

- Implement multipart upload route.
- Enforce max 50 MB and MIME allowlist.

### 3.2 Cloudinary integration

- Signed server-side uploads.
- Persist URL + public ID.
- Retry/timeout/error mapping.

### 3.3 Persistence and ownership

- Persist user-owned `videos` records.
- Enforce cross-user access restrictions.

### 3.4 Tests

- Valid/invalid upload tests.
- Cloud failure-path tests.
- Authorization tests.

### Checkpoint CP-3 (Gate)

- Required pass:
  - Upload flow stable and tested.
  - Cleanup and error paths pass.
- Required docs update:
  - `docs/phases/phase-3-checkpoint.md`
  - `docs/api/video-upload.md`
  - `docs/integrations/cloudinary.md`

## Phase 4 - Analysis Orchestration (Within Same Backend)

### 4.1 Analysis workflow model

- `analysis` table with status lifecycle.
- Persist result payload and safe error details.

### 4.2 Backend processing

- Create analysis job on upload (`PENDING` -> `PROCESSING`).
- Run analysis pipeline and validate output fields:
  - `min_angle`, `max_angle`, `movement_score`, `raw_json`.

### 4.3 Failure behavior and resilience

- Handle timeout/malformed input safely.
- Mark `FAILED` with stable diagnostics.
- Preserve uploaded media references.

### 4.4 Tests and performance checks

- Success/failure integration tests.
- API latency and analysis-duration target checks.

### Checkpoint CP-4 (Gate)

- Required pass:
  - Analysis workflow tests green.
  - Failure responses deterministic and safe.
- Required docs update:
  - `docs/phases/phase-4-checkpoint.md`
  - `docs/api/analysis.md`
  - `docs/integrations/analysis-pipeline.md`

## Phase 5 - Mobile App MVP Flows

### 5.1 Auth and profile screens

- Register/login UI and token lifecycle.
- Profile create/edit UX.

### 5.2 Video capture flow

- Record 5-15 second video with `expo-camera`.
- Client-side duration validation.
- Preview with `expo-video`.

### 5.3 Upload and result UX

- Upload progress and retry flows.
- Analysis status polling/refresh.
- Safe error messaging.

### 5.4 Results and history

- Display min/max angle, ROM, score.
- Show history list.

### 5.5 Tests

- Component tests for critical screens.
- E2E smoke path.

### Checkpoint CP-5 (Gate)

- Required pass:
  - End-to-end patient flow works.
  - FR-1 to FR-16 mapped to tests.
- Required docs update:
  - `docs/phases/phase-5-checkpoint.md`
  - `docs/mobile/user-flows.md`
  - `docs/traceability/fr-to-tests.md`

## Phase 6 - Security, Observability, and Reliability Hardening

### 6.1 Security hardening

- Security middleware, strict CORS, request limits.
- Rate limiting on auth/upload.
- Input validation everywhere.

### 6.2 Observability

- Structured logs with request IDs.
- Metrics for latency, failure rates, and analysis duration.
- Tracing for critical request paths.

### 6.3 Reliability

- Health/readiness endpoints.
- PostgreSQL backup/restore runbook.
- Upload integrity and retry verification.

### Checkpoint CP-6 (Gate)

- Required pass:
  - Security checklist has no critical findings.
  - Telemetry and alerts verified.
  - Backup restore drill successful.
- Required docs update:
  - `docs/phases/phase-6-checkpoint.md`
  - `docs/security/hardening-checklist.md`
  - `docs/observability/telemetry.md`
  - `docs/operations/backup-restore.md`

## Phase 7 - Release Readiness and Production Launch

### 7.1 Containerization and deployment

- Dockerize FastAPI backend and PostgreSQL stack.
- Pinned base images and non-root runtime.

### 7.2 CI/CD and release controls

- CI gates: lint/type/test/security checks.
- Promotion: dev -> staging -> prod.

### 7.3 Final validation

- Performance validation for MVP targets.
- Regression suite on acceptance criteria.
- Incident runbook dry run.

### Checkpoint CP-7 (Final Gate)

- Required pass:
  - All SRD acceptance criteria passed in staging.
  - Release checklist approved.
- Required docs update:
  - `docs/phases/phase-7-checkpoint.md`
  - `docs/release/release-checklist.md`
  - `docs/release/post-release-monitoring.md`

## 6. FR Traceability to Phase Gates

- FR-1 to FR-6 -> Phase 2.
- FR-7 to FR-11 -> Phase 3 + Phase 5.
- FR-12 to FR-14 -> Phase 4.
- FR-15 to FR-16 -> Phase 5.
- NFRs -> Phase 6 + Phase 7.

## 7. Source References (Official, Accessed 2026-02-28)

- GitHub CLI `gh repo create`: <https://cli.github.com/manual/gh_repo_create>
- Expo Camera: <https://docs.expo.dev/versions/latest/sdk/camera/>
- Expo Video (`expo-video`): <https://docs.expo.dev/versions/latest/sdk/video/>
- Expo SecureStore: <https://docs.expo.dev/versions/latest/sdk/securestore/>
- FastAPI file uploads: <https://fastapi.tiangolo.com/tutorial/request-files/>
- FastAPI error handling: <https://fastapi.tiangolo.com/tutorial/handling-errors/>
- FastAPI CORS: <https://fastapi.tiangolo.com/tutorial/cors/>
- PostgreSQL constraints: <https://www.postgresql.org/docs/current/ddl-constraints.html>
- Cloudinary upload docs: <https://cloudinary.com/documentation/upload_images>
- Docker build best practices: <https://docs.docker.com/build/building/best-practices/>
- OWASP password storage: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
