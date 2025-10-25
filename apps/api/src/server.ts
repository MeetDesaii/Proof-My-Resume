/// <reference types="@clerk/express/env" />
/// <reference types="./types/express" />

import { config } from "./config/env";

import { createApp, initializeApp } from "./app";
import { logger } from "./utils/logger";
import { createServer } from "http";
import { gracefulShutdown } from "./utils/shutdown";

const PORT = config.port;
const HOST = config.host;

const startServer = async () => {
  try {
    await initializeApp();
    const app = createApp();

    const server = createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Frontend URL: ${config.frontendUrl}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => gracefulShutdown(server));
    process.on("SIGINT", () => gracefulShutdown(server));
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
};

startServer();
