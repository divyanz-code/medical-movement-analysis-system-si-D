from collections import defaultdict
from threading import Lock


class MetricsRegistry:
    def __init__(self) -> None:
        self._counters: dict[str, int] = defaultdict(int)
        self._timings_ms: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def inc(self, key: str, value: int = 1) -> None:
        with self._lock:
            self._counters[key] += value

    def observe_ms(self, key: str, value: float) -> None:
        with self._lock:
            self._timings_ms[key].append(value)

    def snapshot(self) -> dict:
        with self._lock:
            timings = {
                key: {
                    'count': len(values),
                    'avg_ms': round(sum(values) / len(values), 2) if values else 0.0,
                    'max_ms': round(max(values), 2) if values else 0.0,
                }
                for key, values in self._timings_ms.items()
            }

            return {
                'counters': dict(self._counters),
                'timings_ms': timings,
            }
