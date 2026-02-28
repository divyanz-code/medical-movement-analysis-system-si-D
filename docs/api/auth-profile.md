# Auth & Profile API (Phase 2)

Implemented endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/profile`
- `PUT /api/v1/profile`

Notes:
- Email uniqueness enforced at app and DB levels.
- Passwords are hashed with bcrypt via Passlib.
- JWT bearer tokens required for profile routes.
- Error responses follow a consistent envelope including `request_id`.
