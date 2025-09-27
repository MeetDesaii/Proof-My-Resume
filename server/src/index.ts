import express from "express";
import { resumeRouter } from "./routes/resume";
import { authRouter } from "./routes/auth";
import cors from "cors";
import { aiRouter } from "./routes/ai";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/resume", resumeRouter);
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

// Centralized error handler (handles unique constraint, etc.)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Unique constraint failed." });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
