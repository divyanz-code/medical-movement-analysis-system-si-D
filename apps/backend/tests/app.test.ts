import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { createLogger } from "../src/logging/logger.js";

describe("health route", () => {
  it("returns 200 with status ok", async () => {
    const app = createApp(createLogger({ NODE_ENV: "test", PORT: 8080, LOG_LEVEL: "silent" }));

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
