import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = Router();

// Clerk webhook endpoint (no auth required)
router.post("/webhook", authController.handleWebhook);

// Verify session
router.get("/verify", requireAuth, authController.verifySession);

export default router;
