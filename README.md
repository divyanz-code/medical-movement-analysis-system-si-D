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

Auto-detect LAN IP and start Expo (recommended):

```bash
npm run mobile:start
```

If QR/LAN mode has connectivity issues, use tunnel:

```bash
npm run mobile:start:tunnel
```

## Execution Model

Development follows phased checkpoints documented in:
- `PHASE_WISE_IMPLEMENTATION_PLAN.md`
- `docs/phases/phase-1-checkpoint.md`
