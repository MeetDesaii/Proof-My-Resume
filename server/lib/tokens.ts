import crypto from "crypto";

export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateShareableLink(): string {
  return crypto.randomBytes(16).toString("hex");
}
