# Analysis Pipeline Integration (Phase 4)

## Flow

1. Video upload endpoint persists `videos` record.
2. Upload flow creates `analysis` record with `PENDING`.
3. Background task executes analysis processing:
   - set `PROCESSING`
   - run analyzer engine on `cloud_url`
   - validate result fields
   - persist `SUCCEEDED` result or `FAILED` error

## Components

- API trigger: `services/backend/app/api/videos.py`
- Orchestration service: `services/backend/app/services/analysis_service.py`
- Analyzer contract: `services/backend/app/services/analysis_engine.py`
- Repository: `services/backend/app/repositories/analysis_repository.py`

## Validation Rules

- `max_angle >= min_angle`
- `movement_score` in `[0, 1]`

## Failure Behavior

- Analyzer exceptions are converted to safe stored status:
  - `status = FAILED`
  - `error_code = ANALYSIS_PROCESSING_FAILED`
  - `error_message = Failed to process movement analysis`

No stack traces or sensitive internals are exposed in API responses.
