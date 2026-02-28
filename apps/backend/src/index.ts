import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { createLogger } from "./logging/logger.js";

const env = loadEnv();
const logger = createLogger(env);
const app = createApp(logger);

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "backend listening");
});
