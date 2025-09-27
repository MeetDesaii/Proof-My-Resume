import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config";
import prisma from "../prisma";
import { generateVerifyToken } from "../../lib/tokens";

const router: any = Router();

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Sign up
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = signUpSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const verifyToken = generateVerifyToken();

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          verifyToken,
        },
      });

      const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Sign in
router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = signInSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify email
router.get(
  "/verify/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      const user = await prisma.user.findUnique({
        where: { verifyToken: token },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid token" });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verifyToken: null,
        },
      });

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
