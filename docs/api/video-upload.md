# Video Upload API (Phase 3)

## Endpoint

- `POST /api/v1/videos` (multipart/form-data)
- Auth required: Bearer token

## Fields

- `video` (required): video file
- `duration_seconds` (required): integer, 5 to 15

## Validation

- MIME type must start with `video/`
- Max file size enforced by backend (`MAX_VIDEO_SIZE_MB`, default 50)
- Duration must be within configured bounds (`MIN_VIDEO_DURATION_SECONDS`, `MAX_VIDEO_DURATION_SECONDS`)

## Response

- `202 Accepted`

```json
{
  "video_id": 123,
  "status": "PENDING"
}
```

## Additional Endpoint

- `GET /api/v1/videos/{video_id}`
- Returns persisted video metadata only for owner.
- Cross-user access returns `403 FORBIDDEN_RESOURCE`.

## Error Codes

- `UNSUPPORTED_MEDIA_TYPE`
- `FILE_TOO_LARGE`
- `INVALID_DURATION`
- `FORBIDDEN_RESOURCE`
- `VIDEO_NOT_FOUND`
- `STORAGE_NOT_CONFIGURED`
- `CLOUD_UPLOAD_FAILED`
