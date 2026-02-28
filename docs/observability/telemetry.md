# Telemetry and Observability (Phase 6)

## Structured Logging

- JSON logs emitted for each request with:
  - `request_id`
  - `method`
  - `path`
  - `status_code`
  - `duration_ms`
- Logger configured in: `services/backend/app/core/logging.py`.

## Metrics

- In-memory counters and timings registry exposed at `GET /metrics`.
- Current metrics include:
  - `http_requests_total.<METHOD>.<STATUS_CODE>` counters
  - `http_request_duration_ms` aggregates (`count`, `avg_ms`, `max_ms`)

## Health Probes

- `GET /health`: liveness probe.
- `GET /ready`: readiness probe with DB connectivity validation.

## Next Hardening Step

- Export metrics to Prometheus/OpenTelemetry collector in deployment environments.
