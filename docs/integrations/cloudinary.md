# Cloudinary Integration (Phase 3)

## Implementation

- Adapter: `CloudinaryVideoStorage`
- File: `services/backend/app/services/storage_service.py`
- Upload mode: signed server-side upload (`resource_type=video`)
- Folder: configurable (`CLOUDINARY_FOLDER`, default `mma/videos`)

## Required Environment Variables

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Runtime Behavior

- If Cloudinary credentials are missing, upload endpoint fails safely with:
  - `503 STORAGE_NOT_CONFIGURED`
- Provider errors are mapped to:
  - `502 CLOUD_UPLOAD_FAILED`

## Security Notes

- Client never uploads directly to Cloudinary in current backend flow.
- Credentials remain server-side only.
- Uploaded object metadata (`cloud_url`, `cloud_public_id`) is stored in DB.
