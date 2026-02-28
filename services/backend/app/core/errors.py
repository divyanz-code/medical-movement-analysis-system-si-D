from dataclasses import dataclass


@dataclass
class DomainError(Exception):
    status_code: int
    code: str
    message: str
