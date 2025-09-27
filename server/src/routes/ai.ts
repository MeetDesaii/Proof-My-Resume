import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import OpenAI from "openai";
import { config } from "../config";
import { authenticate } from "../middleware/auth";
import {
  analyzeJobDescription,
  tailorResume,
  calculateATSScore,
  normalizeATSAnalysis,
  normalizeTailoredContent,
} from "../services/aiService";
import prisma from "../prisma";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const router: any = Router();

const tailorRequestSchema = z.object({
  resumeId: z.string(),
  jobDescription: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  jobUrl: z.string().optional(),
});

const analyzeRequestSchema = z.object({
  resumeId: z.string(),
  jobDescription: z.string(),
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Apply auth middleware to all routes
router.use(authenticate);

// Analyze job description and tailor resume
router.post(
  "/tailor",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { resumeId, jobDescription, jobTitle, company, jobUrl } =
        tailorRequestSchema.parse(req.body);

      // Get resume
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: req.user!.userId,
        },
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      try {
        // Analyze job description
        const jdAnalysis = await analyzeJobDescription(openai, jobDescription);

        // Calculate ATS score and get missing keywords
        const atsAnalysis = await calculateATSScore(
          openai,
          resume.parsedContent,
          jobDescription,
          jdAnalysis
        );

        // Normalize the analysis
        const normalizedATS = normalizeATSAnalysis(atsAnalysis);

        // Create job application record
        const application = await prisma.jobApplication.create({
          data: {
            userId: req.user!.userId,
            jobTitle,
            company,
            jobDescription,
            jobUrl: jobUrl ?? null,
            atsScore: normalizedATS.score,
            missingKeywords: normalizedATS.missingKeywords,
            matchedKeywords: normalizedATS.matchedKeywords,
            suggestions: normalizedATS.suggestions,
          },
        });

        // Tailor resume content
        const tailoredContent = await tailorResume(
          openai,
          resume.parsedContent,
          jdAnalysis,
          normalizedATS
        );

        // Normalize tailored content
        const normalizedTailored = normalizeTailoredContent(tailoredContent);

        // Create tailored resume
        const tailoredResume = await prisma.tailoredResume.create({
          data: {
            resumeId,
            applicationId: application.id,
            content: normalizedTailored.content,
            highlightedChanges: {
              changes: normalizedTailored.changes,
              addedKeywords: normalizedTailored.addedKeywords,
            },
            improvementScore: normalizedTailored.improvementScore,
          },
          include: {
            resume: true,
            application: true,
          },
        });

        // Update application status
        await prisma.jobApplication.update({
          where: { id: application.id },
          data: { status: "TAILORED" },
        });

        res.json({
          application,
          tailoredResume,
          analysis: {
            atsScore: normalizedATS.score,
            missingKeywords: normalizedATS.missingKeywords,
            matchedKeywords: normalizedATS.matchedKeywords,
            suggestions: normalizedATS.suggestions,
            highlightedChanges: normalizedTailored.changes,
          },
        });
      } catch (aiError: any) {
        console.error("AI Service Error:", aiError);
        return res.status(500).json({
          error: "Failed to process resume with AI service",
          details:
            process.env.NODE_ENV === "development"
              ? aiError.message
              : undefined,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Get tailoring suggestions without creating records
router.post(
  "/analyze",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { resumeId, jobDescription } = analyzeRequestSchema.parse(req.body);

      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: req.user!.userId,
        },
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const jdAnalysis = await analyzeJobDescription(openai, jobDescription);
      const atsAnalysis = await calculateATSScore(
        openai,
        resume.parsedContent,
        jobDescription,
        jdAnalysis
      );

      const normalizedAnalysis = normalizeATSAnalysis(atsAnalysis);

      res.json({
        atsScore: normalizedAnalysis.score,
        missingKeywords: normalizedAnalysis.missingKeywords,
        matchedKeywords: normalizedAnalysis.matchedKeywords,
        suggestions: normalizedAnalysis.suggestions,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all applications for the user
router.get(
  "/applications",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const applications = await prisma.jobApplication.findMany({
        where: { userId: req.user!.userId },
        include: {
          tailoredResume: {
            include: {
              resume: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ applications });
    } catch (error) {
      next(error);
    }
  }
);

// Get single tailored resume by tailored resume ID
router.get(
  "/tailored/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const tailoredResume = await prisma.tailoredResume.findFirst({
        where: {
          id: id as string,
          application: {
            userId: req.user!.userId,
          },
        },
        include: {
          resume: {
            select: {
              id: true,
              fileName: true,
              parsedContent: true,
              skills: true,
            },
          },
          application: {
            select: {
              id: true,
              jobTitle: true,
              company: true,
              jobDescription: true,
              jobUrl: true,
              atsScore: true,
              missingKeywords: true,
              matchedKeywords: true,
              suggestions: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!tailoredResume) {
        return res.status(404).json({ error: "Tailored resume not found" });
      }

      // Format the response to match what the frontend expects
      res.json({
        application: {
          id: tailoredResume.applicationId,
          jobTitle: tailoredResume.application.jobTitle,
          company: tailoredResume.application.company,
          jobDescription: tailoredResume.application.jobDescription,
          jobUrl: tailoredResume.application.jobUrl,
          atsScore: tailoredResume.application.atsScore,
          missingKeywords: tailoredResume.application.missingKeywords,
          matchedKeywords: tailoredResume.application.matchedKeywords,
          suggestions: tailoredResume.application.suggestions,
          status: tailoredResume.application.status,
          createdAt: tailoredResume.application.createdAt,
          tailoredResume: {
            id: tailoredResume.id,
            content: tailoredResume.content,
            highlightedChanges: tailoredResume.highlightedChanges,
            improvementScore: tailoredResume.improvementScore,
            createdAt: tailoredResume.createdAt,
            resume: tailoredResume.resume,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching tailored resume:", error);
      next(error);
    }
  }
);

// Alternative: Get application with tailored resume by application ID
router.get(
  "/application/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const application = await prisma.jobApplication.findFirst({
        where: {
          id: id as string,
          userId: req.user!.userId,
        },
        include: {
          tailoredResume: {
            include: {
              resume: {
                select: {
                  id: true,
                  fileName: true,
                  parsedContent: true,
                  skills: true,
                },
              },
            },
          },
        },
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Format the response
      res.json({ application });
    } catch (error) {
      console.error("Error fetching application:", error);
      next(error);
    }
  }
);

export { router as aiRouter };
