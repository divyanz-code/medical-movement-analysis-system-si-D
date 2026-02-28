# Medical Movement Analysis System - Phase-Wise Implementation Plan

Date: 2026-02-28  
Input baseline: [`SRD.md`](/Users/shauryaagrawal/Desktop/CVProject/SRD.md) (v1.0, dated 2026-02-28)

## 1. Baseline Review (Completed Before Planning)

- Local codebase reviewed: only [`SRD.md`](/Users/shauryaagrawal/Desktop/CVProject/SRD.md) exists.
- Local configs reviewed: none found.
- Local tests reviewed: none found.
- Remote repository created with GitHub CLI:
  - URL: <https://github.com/Shauryacious/medical-movement-analysis-system>
  - Command used: `gh repo create medical-movement-analysis-system --private --source=. --remote=origin`

## 2. Research-Driven Decisions (Current Official Docs)

1. Use `expo-camera` for capture, and `expo-video` for preview playback.
Reason: Expo docs show `expo-camera` for recording and also show `expo-av` video package as deprecated while `expo-video` is current.
2. Use `expo-secure-store` for token persistence.
Reason: It stores Android values encrypted via Keystore and iOS via Keychain; however, server remains source of truth.
3. Enforce strict Express production hardening.
Reason: Express production security guidance explicitly recommends TLS and Helmet.
4. Restrict upload middleware to target routes + set hard file limits.
Reason: Multer docs warn against global middleware and advise limits to reduce DoS risk.
5. Use server-side signed Cloudinary uploads for production.
Reason: Cloudinary docs mark unsigned uploads as for low-security/prototyping and document signed upload flow.
6. Keep FastAPI error contracts explicit and async work isolated.
Reason: FastAPI recommends `HTTPException`; background tasks are supported and useful for non-blocking operations.
7. Enforce relational integrity and uniqueness in PostgreSQL schema.
Reason: PostgreSQL docs confirm `UNIQUE` constraints auto-create unique B-tree indexes.
8. Plan optional row-level security for future hardening.
Reason: PostgreSQL row security has default-deny behavior when enabled without matching policies.
9. Avoid CORS wildcard with credentials.
Reason: FastAPI CORS docs note wildcard excludes credentialed flows (auth headers/cookies).
10. Build container images with multi-stage, pinned bases, ephemeral runtime expectations.
Reason: Docker best-practices documentation recommends all three.

## 3. Architecture Blueprint (Phase 1 MVP)

### 3.1 Services

- Mobile app: React Native + Expo.
- Backend API: Node.js + Express + TypeScript.
- Database: PostgreSQL.
- Object storage: Cloudinary.
- AI service: Python + FastAPI (`POST /analyze`).

### 3.2 Core Backend API Surface (v1)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/profile`
- `PUT /api/v1/profile`
- `POST /api/v1/videos` (multipart, max 50 MB)
- `GET /api/v1/analysis/:videoId`
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
  - controllers -> services -> repositories -> integrations.
- Config via environment variables with strict startup validation.
- Structured logging with request correlation IDs.
- Secure-by-default:
  - TLS everywhere outside local dev.
  - JWT auth on protected routes.
  - Password hashing via bcrypt (SRD requirement), with configurable work factor.
  - Explicit CORS origin allowlist.
  - Authorization checks for user-owned resources.

## 4. Phase Gate Rules (Mandatory)

1. A phase cannot start until previous checkpoint is `PASS`.
2. Every checkpoint must include a doc update before sign-off.
3. If any acceptance test fails, phase status is `BLOCKED`.
4. If uncertainty remains, add a short tradeoff note to the phase doc and resolve before progressing.
5. No production deploy until all Phase 1 acceptance criteria are traceably passed.

## 5. Phase Plan (With Subphases and Checkpoints)

## Phase 1 - Foundation and Governance

### 1.1 Repository and workspace bootstrap

- Establish monorepo layout:
  - `apps/mobile`
  - `apps/backend`
  - `services/ai`
  - `infra`
  - `docs`

### 1.2 Tooling and quality baseline

- TypeScript strict mode in backend.
- Lint/format/typecheck scripts.
- Test harness setup:
  - Backend unit + integration.
  - AI service unit + API tests.
  - Mobile unit/component smoke tests.

### 1.3 Architecture artifacts

- API contract draft.
- Sequence diagram for upload -> AI -> result.
- Risk register (security/performance/reliability).

### Checkpoint CP-1 (Gate)

- Required pass:
  - Local CI scripts run green.
  - Repo structure created.
  - Architecture docs reviewed.
- Required docs update:
  - `docs/phases/phase-1-checkpoint.md`
  - `docs/architecture/overview.md`

## Phase 2 - Identity, Auth, and Profile Domain

### 2.1 Schema and migrations

- Create `users` and `profiles`.
- Enforce `users.email` uniqueness.
- Add ownership foreign keys and timestamps.

### 2.2 Auth APIs

- Implement register/login endpoints.
- Hash passwords with bcrypt.
- Issue JWT with bounded expiry and explicit claims.

### 2.3 Profile APIs

- Implement get/update profile.
- Validate domain values (age bounds, limb enum, gender enum).

### 2.4 Tests

- Unit tests for services and validators.
- Integration tests for auth/profile routes.
- Negative-path tests (duplicate email, invalid token, invalid profile payload).

### Checkpoint CP-2 (Gate)

- Required pass:
  - Auth + profile test suite green.
  - Security checks: no plaintext password writes, protected endpoints enforced.
- Required docs update:
  - `docs/phases/phase-2-checkpoint.md`
  - `docs/api/auth-profile.md`
  - `docs/security/auth-model.md`

## Phase 3 - Video Ingestion and Cloud Storage

### 3.1 Upload endpoint and validation

- Add `POST /api/v1/videos` multipart endpoint.
- Configure Multer only on upload route.
- Enforce limits:
  - Max size 50 MB.
  - MIME whitelist for supported video types.

### 3.2 Cloudinary integration

- Implement signed upload from backend.
- Capture and persist cloud URL + public ID.
- Add retry/timeout/error mapping for cloud failures.

### 3.3 Persistence and ownership

- Create `videos` records with user ownership.
- Ensure users can only access their own uploads.

### 3.4 Tests

- Multipart upload tests with valid and invalid payloads.
- Cloud adapter tests (success, timeout, provider error).
- Authorization tests for cross-user access.

### Checkpoint CP-3 (Gate)

- Required pass:
  - Upload flow stable under repeated uploads.
  - All file cleanup and error-path tests pass.
- Required docs update:
  - `docs/phases/phase-3-checkpoint.md`
  - `docs/api/video-upload.md`
  - `docs/integrations/cloudinary.md`

## Phase 4 - AI Analysis Orchestration

### 4.1 Analysis workflow model

- Add `analysis` table with status lifecycle.
- Persist request/response metadata and safe error fields.

### 4.2 Backend orchestration

- After upload, create analysis job (`PENDING` -> `PROCESSING`).
- Call FastAPI service with timeout and retry policy.
- Parse and validate expected response fields:
  - `min_angle`, `max_angle`, `movement_score`, `raw_json`.

### 4.3 Failure behavior and resilience

- Graceful handling for AI timeout or malformed response.
- Mark `FAILED` with non-sensitive diagnostic codes.
- Guarantee no data loss for already uploaded videos.

### 4.4 Tests and performance checks

- Integration tests with mocked AI:
  - success
  - timeout
  - malformed payload
- Validate API responses stay under 500 ms excluding analysis wait.
- Validate analysis completion target under 30 seconds for normal payloads.

### Checkpoint CP-4 (Gate)

- Required pass:
  - AI workflow tests green.
  - Failure paths return safe, deterministic API responses.
- Required docs update:
  - `docs/phases/phase-4-checkpoint.md`
  - `docs/api/analysis.md`
  - `docs/integrations/ai-service.md`

## Phase 5 - Mobile App MVP Flows

### 5.1 Auth and profile screens

- Register/login UI and token lifecycle.
- Profile create/edit with validation feedback.

### 5.2 Video capture flow

- Record 5-15 second video via `expo-camera`.
- Client-side duration check.
- Preview using `expo-video`.

### 5.3 Upload and analysis UX

- Upload progress + retry UX.
- Poll or refresh analysis status.
- Display safe error states to user.

### 5.4 Results and history screens

- Show min/max angle, ROM, movement score.
- List historical analyses.

### 5.5 Tests

- Component and flow tests for key screens.
- Critical-path E2E smoke (auth -> record -> upload -> result).

### Checkpoint CP-5 (Gate)

- Required pass:
  - End-to-end patient flow is demonstrably working.
  - All MVP functional requirements FR-1 to FR-16 mapped to test evidence.
- Required docs update:
  - `docs/phases/phase-5-checkpoint.md`
  - `docs/mobile/user-flows.md`
  - `docs/traceability/fr-to-tests.md`

## Phase 6 - Security, Observability, and Reliability Hardening

### 6.1 Security hardening

- Helmet, strict CORS origins, request size guards.
- Rate limiting for auth and upload endpoints.
- Input validation for all externally sourced data.

### 6.2 Observability

- Structured logs for backend and AI service.
- Correlation IDs across upload/analysis flow.
- OpenTelemetry traces and core metrics:
  - request latency
  - upload failure rate
  - analysis duration
  - AI error rate

### 6.3 Reliability

- Health/readiness endpoints.
- Backup and restore procedure for PostgreSQL.
- Cloudinary object integrity checks and retry policy validation.

### Checkpoint CP-6 (Gate)

- Required pass:
  - Security checklist complete with no critical findings.
  - Telemetry dashboards/alerts verified.
  - Backup restore drill successful.
- Required docs update:
  - `docs/phases/phase-6-checkpoint.md`
  - `docs/security/hardening-checklist.md`
  - `docs/observability/telemetry.md`
  - `docs/operations/backup-restore.md`

## Phase 7 - Release Readiness and Production Launch

### 7.1 Containerization and deployment

- Dockerize backend and AI service with multi-stage builds.
- Pin base image versions/digests.
- Validate ephemeral runtime assumptions.

### 7.2 CI/CD and release controls

- CI gates: lint, typecheck, unit, integration, security scan.
- Environment promotion strategy: dev -> staging -> prod.

### 7.3 Final validation

- Load/perf validation for MVP targets.
- Regression suite for all MVP criteria.
- Incident runbook dry run.

### Checkpoint CP-7 (Final Gate)

- Required pass:
  - All SRD acceptance criteria passed in staging.
  - Production release checklist approved.
- Required docs update:
  - `docs/phases/phase-7-checkpoint.md`
  - `docs/release/release-checklist.md`
  - `docs/release/post-release-monitoring.md`

## 6. FR Traceability to Phase Gates

- FR-1 to FR-6 -> Phase 2 checkpoint.
- FR-7 to FR-11 -> Phase 3 + Phase 5 checkpoints.
- FR-12 to FR-14 -> Phase 4 checkpoint.
- FR-15 to FR-16 -> Phase 5 checkpoint.
- NFR security/performance/reliability/scalability -> Phase 6 + Phase 7 checkpoints.

## 7. Source References (Official, Accessed 2026-02-28)

- GitHub CLI `gh repo create`: <https://cli.github.com/manual/gh_repo_create>
- Expo Camera: <https://docs.expo.dev/versions/latest/sdk/camera/>
- Expo Video (`expo-video`): <https://docs.expo.dev/versions/latest/sdk/video/>
- Expo Video (`expo-av`) deprecation context: <https://docs.expo.dev/versions/latest/sdk/video-av/>
- Expo SecureStore: <https://docs.expo.dev/versions/latest/sdk/securestore/>
- Express production security: <https://expressjs.com/en/advanced/best-practice-security.html>
- Multer middleware guidance: <https://expressjs.com/en/resources/middleware/multer.html>
- Cloudinary Node upload docs: <https://cloudinary.com/documentation/node_image_and_video_upload>
- Cloudinary upload API: <https://cloudinary.com/documentation/upload_images>
- Cloudinary upload parameters: <https://cloudinary.com/documentation/upload_parameters>
- FastAPI background tasks: <https://fastapi.tiangolo.com/tutorial/background-tasks/>
- FastAPI error handling: <https://fastapi.tiangolo.com/tutorial/handling-errors/>
- FastAPI CORS: <https://fastapi.tiangolo.com/tutorial/cors/>
- PostgreSQL constraints: <https://www.postgresql.org/docs/current/ddl-constraints.html>
- PostgreSQL row security: <https://www.postgresql.org/docs/current/ddl-rowsecurity.html>
- Docker build best practices: <https://docs.docker.com/build/building/best-practices/>
- OWASP password storage: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- OpenTelemetry JS docs: <https://opentelemetry.io/docs/languages/js/>
- OpenTelemetry Python instrumentation docs: <https://opentelemetry.io/docs/languages/python/instrumentation/>
