# Auth Security Model (Phase 2)

- Password storage: bcrypt hash only, never plaintext.
- Access tokens: JWT (`HS256`) with `sub`, `iat`, `exp`, and role/email claims.
- Token expiry: configurable (`JWT_ACCESS_TOKEN_EXP_MINUTES`, default 60).
- Protected routes require Bearer token and user resolution from DB.
- Auth failures return safe error messages (`INVALID_CREDENTIALS`, `INVALID_TOKEN`).

Production notes:
- Rotate `JWT_SECRET` per environment.
- Enforce HTTPS at ingress.
- Add refresh tokens + token revocation strategy in next phase if needed.
