import express from "express";
import helmet from "helmet";
import crypto from "node:crypto";
import type { Logger } from "pino";

export function createApp(logger: Logger): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use((req, res, next) => {
    const requestIdHeader = req.headers["x-request-id"];
    const requestId =
      typeof requestIdHeader === "string" && requestIdHeader.length > 0
        ? requestIdHeader
        : crypto.randomUUID();
    res.setHeader("x-request-id", requestId);

    const start = performance.now();
    res.on("finish", () => {
      logger.info(
        {
          requestId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Number((performance.now() - start).toFixed(2))
        },
        "request completed"
      );
    });

    next();
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
}
