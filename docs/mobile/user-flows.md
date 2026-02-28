# Mobile User Flows (Phase 5)

## Patient MVP Journey

1. Register + login.
2. Complete profile (`age`, `gender`, `affected_limb`).
3. Record a 5-15 second video using Expo camera module.
4. Preview clip with Expo video playback module.
5. Upload video to backend.
6. Poll analysis status until terminal result.
7. View result metrics:
   - min angle
   - max angle
   - range of motion
   - movement score
8. Open history screen for prior analyses.

## Technical Mapping

- Flow orchestration service: `apps/mobile/src/flows/patientFlow.ts`
- API layer: `apps/mobile/src/api/mobileApi.ts`
- Token lifecycle abstraction: `apps/mobile/src/storage/tokenStore.ts`
- Analysis/ROM utility: `apps/mobile/src/types/domain.ts`

## UX Error States

- Not authenticated: block protected actions.
- Invalid recording duration: fail fast before upload API call.
- Analysis timeout/failure: show safe status + retry/refresh option.
