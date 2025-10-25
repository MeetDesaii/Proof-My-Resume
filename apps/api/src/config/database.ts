import mongoose from "mongoose";
import { logger } from "../utils/logger";
import config from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("MongoDB connected successfully");

    // Initialize Redis
    // await createRedisClient();

    mongoose.connection.on("error", (error) => {
      logger.error(error, "MongoDB connection error:");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.error(error, "Database connection failed");
    throw error;
  }
};
