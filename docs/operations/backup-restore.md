# Backup and Restore Runbook (Phase 6)

## Scope

PostgreSQL backup/restore for MVP data durability.

## Backup (logical)

Example command:

```bash
pg_dump "$DATABASE_URL" --format=custom --file backup_$(date +%F_%H%M).dump
```

## Restore

Example commands:

```bash
dropdb --if-exists mma_restore
createdb mma_restore
pg_restore --dbname=postgresql://postgres:postgres@localhost:5432/mma_restore backup_YYYY-MM-DD_HHMM.dump
```

## Validation

- Verify row counts for `users`, `profiles`, `videos`, `analysis`.
- Run API smoke checks after restore:
  - `/health`
  - `/ready`
  - authenticated history fetch

## Retention

- Daily backups retained for 14 days (minimum).
- Weekly backup retained for 8 weeks.
