import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.middleware";
import { createJob } from "../controllers/job.controller";

const router: Router = Router();

// All routes require authentication
router.use(requireAuth);
router.use(attachUser);

router.post("/", createJob);

export default router;
