import { structuredExtract } from "../langchian.config";
import { RESUME_TAILORING_SYSTEM_PROMPT } from "../prompts/tailoring-prompt";
import { ResumeExtractionSchema, ResumeReviewSchema } from "../schema";

export async function extractResumeContent(resumeText: string) {
  const result = await structuredExtract({
    schema: ResumeExtractionSchema,
    input: [
      { role: "system", content: "" },
      {
        role: "user",
        content: `Extract fields from this resume text:\n\n${resumeText}`,
      },
    ],
    model: "gpt-4.1-mini",
  });

  return result;
}

export async function tailorResumeContent({
  resumeData,
  jobDescription,
}: {
  resumeData: string;
  jobDescription: string;
}) {
  const userMessage = jobDescription
    ? `# RESUME TO REVIEW
${JSON.stringify(resumeData, null, 2)}

# TARGET JOB DESCRIPTION
${jobDescription}

Please analyze this resume against the job description and generate tailored suggestions to optimize it for this specific role. Focus on keyword alignment, relevant experience highlighting, and ATS optimization for this position.`
    : `# RESUME TO REVIEW
${JSON.stringify(resumeData, null, 2)}

Please analyze this resume and generate suggestions to improve its overall effectiveness, ATS compatibility, and professional presentation. Since no specific job description is provided, focus on general best practices and making achievements more impactful.`;

  const result = await structuredExtract({
    schema: ResumeReviewSchema,
    input: [
      { role: "system", content: RESUME_TAILORING_SYSTEM_PROMPT },
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "gpt-4.1",
  });

  return result;
}
