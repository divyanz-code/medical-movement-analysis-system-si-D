# FR to Tests Traceability (Phase 5)

## Authentication and Profile

- FR-1, FR-2, FR-3, FR-4:
  - `services/backend/tests/test_main.py`
    - `test_auth_register_and_login_success`
    - `test_auth_rejects_duplicate_email`
    - `test_auth_rejects_invalid_credentials`
- FR-5, FR-6:
  - `services/backend/tests/test_main.py`
    - `test_profile_update_and_fetch`

## Video Recording and Upload

- FR-7, FR-8 (mobile logic + validation):
  - `apps/mobile/tests/patientFlow.test.ts`
    - `completes register-login-profile-update-upload-analysis flow`
    - `rejects out-of-range duration before API call`
- FR-9, FR-10, FR-11:
  - `services/backend/tests/test_main.py`
    - `test_video_upload_success`
    - `test_video_rejects_unsupported_mime`
    - `test_video_rejects_large_file`
    - `test_video_multiple_uploads_same_user`

## AI/Analysis and Results

- FR-12, FR-13, FR-14:
  - `services/backend/tests/test_main.py`
    - `test_analysis_succeeds_after_upload`
    - `test_analysis_failure_path_is_safe`
- FR-15, FR-16:
  - `services/backend/tests/test_main.py`
    - `test_analysis_succeeds_after_upload` (result fields)
    - `GET /api/v1/analysis/history` assertion
  - `apps/mobile/tests/patientFlow.test.ts`
    - `handles polling progression until terminal state`

## Residual Gap (to close in UI implementation)

- Native Expo camera and preview component rendering tests are pending.
- Planned for next mobile UI pass (screen-level and E2E tests).
