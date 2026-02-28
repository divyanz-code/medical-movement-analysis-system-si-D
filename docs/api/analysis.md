# Analysis API (Phase 4)

## Endpoints

- `GET /api/v1/analysis/{video_id}`
- `GET /api/v1/analysis/history`

Both endpoints require Bearer auth and enforce user ownership by video.

## Lifecycle

Analysis status values:
- `PENDING`
- `PROCESSING`
- `SUCCEEDED`
- `FAILED`

## `GET /api/v1/analysis/{video_id}`

Returns current analysis state for the specified video.

Successful payload example:

```json
{
  "video_id": 101,
  "status": "SUCCEEDED",
  "min_angle": 21.0,
  "max_angle": 88.0,
  "range_of_motion": 67.0,
  "movement_score": 0.83,
  "error_code": null,
  "error_message": null,
  "created_at": "2026-02-28T10:00:00Z",
  "updated_at": "2026-02-28T10:00:02Z"
}
```

Failure payload example:

```json
{
  "video_id": 102,
  "status": "FAILED",
  "min_angle": null,
  "max_angle": null,
  "range_of_motion": null,
  "movement_score": null,
  "error_code": "ANALYSIS_PROCESSING_FAILED",
  "error_message": "Failed to process movement analysis",
  "created_at": "2026-02-28T10:01:00Z",
  "updated_at": "2026-02-28T10:01:03Z"
}
```

## `GET /api/v1/analysis/history`

Returns reverse-chronological list of analysis records for authenticated user.

## Error Codes

- `ANALYSIS_NOT_FOUND`
- `FORBIDDEN_RESOURCE`
