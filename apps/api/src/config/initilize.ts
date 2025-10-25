import { initializeClerk } from "./clerk";
import { logger } from "../utils/logger";

export const initializeServices = async (): Promise<void> => {
  try {
    // Initialize Clerk
    await initializeClerk();
  } catch (error) {
    logger.error(error, "Service initialization failed:");
    throw error;
  }
};
