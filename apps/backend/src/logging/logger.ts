import pino from "pino";
import type { AppEnv } from "../config/env.js";

export function createLogger(env: AppEnv): pino.Logger {
  return pino({
    level: env.LOG_LEVEL,
    base: { service: "mma-backend", env: env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime
  });
}
