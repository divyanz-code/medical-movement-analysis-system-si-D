import json
import logging
from datetime import datetime, timezone


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
        }

        extra = getattr(record, 'extra_fields', None)
        if isinstance(extra, dict):
            payload.update(extra)

        return json.dumps(payload, separators=(',', ':'))


def build_logger(name: str, level: str = 'INFO') -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(level.upper())

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)

    logger.propagate = False
    return logger


def log_event(logger: logging.Logger, level: str, message: str, **extra_fields) -> None:
    method = getattr(logger, level.lower(), logger.info)
    method(message, extra={'extra_fields': extra_fields})
