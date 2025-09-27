import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { getResumeTextForAI, parseResume } from "../services/resumeParser";
import { uploadToS3 } from "../services/storage";
import { authenticate } from "../middleware/auth";
import prisma from "../prisma";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const router: Router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX allowed."));
    }
  },
});

// Apply auth middleware to all routes
router.use(authenticate);

// Upload resume
router.post(
  "/upload",
  upload.single("resume"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await uploadToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      const parsedContent = await parseResume(
        req.file.buffer,
        req.file.mimetype
      );
      console.log("🚀 ~ parsedContent:", parsedContent);

      const resume = await prisma.resume.create({
        data: {
          userId: req.user!.userId,
          fileName: req.file.originalname,
          fileUrl,
          parsedContent: parsedContent as any,
          skills: parsedContent.skills || [],
          experience: parsedContent.experience
            ? JSON.parse(JSON.stringify(parsedContent.experience))
            : [],
          education: parsedContent.education
            ? JSON.parse(JSON.stringify(parsedContent.education))
            : [],
        },
      });

      res.json({ resume });
    } catch (error) {
      next(error);
    }
  }
);

// Debug endpoint to test resume parsing
router.post(
  "/parse-test",
  upload.single("resume"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const parsedContent = await parseResume(
        req.file.buffer,
        req.file.mimetype
      );

      // Return the full parsed content for debugging
      res.json({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        parsedContent,
        // Also include a formatted version for AI
        formattedText: getResumeTextForAI(parsedContent),
      });
    } catch (error) {
      next(error);
    }
  }
);
// Get user resumes
router.get(
  "/list",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileName: true,
          createdAt: true,
          skills: true,
        },
      });

      res.json({ resumes });
    } catch (error) {
      next(error);
    }
  }
);

// Get single resume
router.get(
  "/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const resume = await prisma.resume.findFirst({
        where: {
          id: id as string,
          userId: req.user!.userId,
        },
        include: {
          tailoredVersions: {
            include: {
              application: true,
            },
          },
        },
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      res.json({ resume });
    } catch (error) {
      next(error);
    }
  }
);

// Delete resume
router.delete(
  "/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const resume = await prisma.resume.findFirst({
        where: {
          id: id as string,
          userId: req.user!.userId,
        },
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      await prisma.resume.delete({
        where: { id: id as string },
      });

      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export { router as resumeRouter };
