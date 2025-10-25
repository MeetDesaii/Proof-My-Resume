import { Request, Response, NextFunction, RequestHandler } from "express";
import { clerkAuth, clerkOptionalAuth } from "../config/clerk";
import { User } from "@visume/database";
import { logger } from "../utils/logger";

// Require authentication
export const requireAuth: RequestHandler = clerkAuth;

// Optional authentication
export const optionalAuth: RequestHandler = clerkOptionalAuth;

// Attach user to request
export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.auth.userId) {
      const user = await User.findOne({ clerkId: req.auth.userId });
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  } catch (error) {
    logger.error(error, "Error attaching user:");
    next();
  }
};

// Check subscription tier
export const requireSubscription = (
  tiers: string[] = ["pro", "enterprise"]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!tiers.includes(user.subscription.tier)) {
        return res.status(403).json({
          error: "This feature requires a higher subscription tier",
          requiredTier: tiers,
          currentTier: user.subscription.tier,
        });
      }

      next();
    } catch (error) {
      logger.error(error, "Subscription check error:");
      res.status(500).json({ error: "Subscription verification failed" });
    }
  };
};

// Check credits
export const requireCredits = (creditsRequired: number = 1) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (user.subscription.creditsRemaining < creditsRequired) {
        return res.status(403).json({
          error: "Insufficient credits",
          creditsRequired,
          creditsRemaining: user.subscription.creditsRemaining,
        });
      }

      next();
    } catch (error) {
      logger.error(error, "Credits check error:");
      res.status(500).json({ error: "Credits verification failed" });
    }
  };
};

// API key authentication for external integrations
export const requireApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({ error: "API key required" });
    }

    // Validate API key (implement your logic)
    const user = await User.findOne({ "apiKeys.key": apiKey });

    if (!user) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    logger.error(error, "API key verification error:");
    res.status(500).json({ error: "API key verification failed" });
  }
};
