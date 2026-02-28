# Medical Movement Analysis System

Monorepo for Phase 1 MVP:

- Mobile app: React Native + Expo
- Backend API + Analysis: Python + FastAPI (single server)
- Data: PostgreSQL

## Repository Structure

- `apps/mobile`
- `services/backend`
- `infra`
- `docs`

## Docker (Backend + PostgreSQL)

- Compose file: `infra/docker-compose.yml`
- Backend image: `services/backend/Dockerfile`

Run:

```bash
docker compose -f infra/docker-compose.yml up --build
```

Backend health:

```bash
curl http://localhost:8000/health
```

## Mobile (Expo)

Set API URL for Expo runtime:

```bash
export EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Run mobile app:

```bash
npm run -w apps/mobile start
```

## Execution Model

Development follows phased checkpoints documented in:
- `PHASE_WISE_IMPLEMENTATION_PLAN.md`
- `docs/phases/phase-1-checkpoint.md`
