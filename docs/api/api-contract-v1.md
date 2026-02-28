# API Contract v1 (Phase 1.3 Draft)

Base path: `/api/v1`
Auth: `Authorization: Bearer <jwt>` for protected routes.
Content type: `application/json` unless multipart noted.

## Auth

### POST `/auth/register`
Request:
```json
{
  "name": "Shaurya Bansal",
  "email": "shaurya@example.com",
  "password": "StrongP@ssw0rd!"
}
```
Response `201`:
```json
{
  "user": {
    "id": "usr_123",
    "name": "Shaurya Bansal",
    "email": "shaurya@example.com",
    "role": "patient"
  }
}
```
Errors: `400` invalid input, `409` email exists.

### POST `/auth/login`
Request:
```json
{
  "email": "shaurya@example.com",
  "password": "StrongP@ssw0rd!"
}
```
Response `200`:
```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "expires_in": 3600
}
```
Errors: `401` invalid credentials.

## Profile

### GET `/profile`
Response `200`:
```json
{
  "name": "Shaurya Bansal",
  "email": "shaurya@example.com",
  "age": 27,
  "gender": "male",
  "affected_limb": "right_knee"
}
```

### PUT `/profile`
Request:
```json
{
  "age": 27,
  "gender": "male",
  "affected_limb": "right_knee"
}
```
Response `200`: same as `GET /profile`.
Errors: `400` invalid values.

## Videos

### POST `/videos` (multipart/form-data)
Fields:
- `video`: file (required, max 50 MB)
- `duration_seconds`: integer (required, 5-15)

Response `202`:
```json
{
  "video_id": "vid_123",
  "status": "PENDING"
}
```
Errors: `400` invalid format, `413` too large, `415` unsupported media type.

## Analysis

### GET `/analysis/{video_id}`
Response `200`:
```json
{
  "video_id": "vid_123",
  "status": "SUCCEEDED",
  "min_angle": 22.5,
  "max_angle": 87.0,
  "range_of_motion": 64.5,
  "movement_score": 0.82,
  "created_at": "2026-02-28T10:00:00Z"
}
```
Possible `status`: `PENDING`, `PROCESSING`, `SUCCEEDED`, `FAILED`.

### GET `/analysis/history`
Response `200`:
```json
{
  "items": [
    {
      "video_id": "vid_123",
      "status": "SUCCEEDED",
      "min_angle": 22.5,
      "max_angle": 87.0,
      "movement_score": 0.82,
      "created_at": "2026-02-28T10:00:00Z"
    }
  ]
}
```

## Error Envelope

All non-2xx responses:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "request_id": "req_abc123"
  }
}
```
