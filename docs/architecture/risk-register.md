# Risk Register (Phase 1.3)

## R1: PII/medical data leakage
- Impact: High
- Likelihood: Medium
- Mitigation: JWT auth on all protected routes, strict ownership checks, no public object URLs without controls, redact logs.

## R2: Upload abuse / oversized payload DoS
- Impact: High
- Likelihood: Medium
- Mitigation: 50 MB hard limit, MIME allowlist, endpoint rate limits, request timeout and body limits.

## R3: Slow analysis impacting UX
- Impact: High
- Likelihood: Medium
- Mitigation: asynchronous processing with status polling, target <30s, timeout and fallback error state.

## R4: Cloud upload failure or transient outages
- Impact: Medium
- Likelihood: Medium
- Mitigation: retries with capped backoff, deterministic failure codes, preserve failed job metadata.

## R5: DB inconsistency between video and analysis rows
- Impact: Medium
- Likelihood: Low
- Mitigation: transactional writes, FK constraints, idempotency keys for repeat submissions.

## R6: Weak secret management
- Impact: High
- Likelihood: Medium
- Mitigation: env var validation at startup, no secrets in repo, rotation policy documented.
