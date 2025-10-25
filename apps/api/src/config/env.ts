import dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";

/**
 * Load environment variables based on NODE_ENV
 * This module MUST be imported before any other application code
 */
function loadEnvironment() {
  // Determine which env file to load
  const nodeEnv = process.env.NODE_ENV || "development";
  const envFile =
    nodeEnv === "production"
      ? ".env.production"
      : nodeEnv === "test"
        ? ".env.test"
        : ".env.development";

  const envPath = path.resolve(process.cwd(), envFile);

  // Check if env file exists
  if (!existsSync(envPath)) {
    console.warn(
      `⚠️  Warning: Environment file not found: ${envFile}\n` +
        `   Expected location: ${envPath}\n` +
        `   Please create it by copying .env.example`
    );
  }

  // Load environment variables
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(`❌ Error loading environment file: ${envFile}`);
    throw result.error;
  }

  console.log(`Environment loaded: ${envFile}`);
}

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = [
    "MONGODB_URI",
    "CLERK_SECRET_KEY",
    "CLERK_WEBHOOK_SECRET",
    "OPENAI_API_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n` +
        missing.map((key) => `   - ${key}`).join("\n")
    );
    console.error(
      `\n💡 Tip: Copy .env.example to .env.${process.env.NODE_ENV || "development"} and fill in the values`
    );
    throw new Error("Missing required environment variables");
  }
}

// Load environment immediately when this module is imported
loadEnvironment();
validateEnvironment();

// Export configuration object for convenience
export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  // Server
  port: parseInt(process.env.PORT || "4000", 10),
  host: process.env.HOST || "0.0.0.0",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Database
  mongoUri: process.env.MONGODB_URI!,
  redisUrl: process.env.REDIS_URL,
  redisPassword: process.env.REDIS_PASSWORD,

  // Authentication
  clerkSecretKey: process.env.CLERK_SECRET_KEY!,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET!,

  // AI Services
  openAiApiKey: process.env.OPENAI_API_KEY!,

  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },

  // File Storage
  fileStorage: {
    type: (process.env.FILE_STORAGE_TYPE as "local" | "s3") || "local",
    uploadDir: process.env.UPLOAD_DIR || "uploads",
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3Bucket: process.env.AWS_S3_BUCKET,
    },
  },

  // Logging
  logging: {
    dir: process.env.LOG_DIR || "logs",
    level: process.env.LOG_LEVEL || "info",
  },
} as const;

export default config;
