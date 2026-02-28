type LogLevel = "debug" | "info" | "warn" | "error";

function isDevRuntime(): boolean {
  const maybeDev = (globalThis as { __DEV?: boolean }).__DEV;
  if (typeof maybeDev === "boolean") {
    return maybeDev;
  }
  return process.env.NODE_ENV !== "production";
}

function write(level: LogLevel, scope: string, message: string, context?: unknown): void {
  if (!isDevRuntime()) {
    return;
  }

  const stamp = new Date().toISOString();
  const prefix = `[MMA][${scope}][${level.toUpperCase()}][${stamp}]`;

  if (context !== undefined) {
    console[level](`${prefix} ${message}`, context);
  } else {
    console[level](`${prefix} ${message}`);
  }
}

export function debug(scope: string, message: string, context?: unknown): void {
  write("debug", scope, message, context);
}

export function info(scope: string, message: string, context?: unknown): void {
  write("info", scope, message, context);
}

export function warn(scope: string, message: string, context?: unknown): void {
  write("warn", scope, message, context);
}

export function error(scope: string, message: string, context?: unknown): void {
  write("error", scope, message, context);
}
