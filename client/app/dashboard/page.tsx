"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Resume } from "@/lib/generated/prisma";
import { ResumeUpload } from "@/components/dashboard/resume-upload";
import { JobDescriptionInput } from "@/components/dashboard/job-description-input";
import { ATSAnalysis } from "@/components/dashboard/ats-analysis";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);

  const { data: resumes, refetch: refetchResumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => api.get("/resume/list").then((res) => res.data.resumes),
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    if (!selectedResume || !jobDescription) return;

    try {
      const response = await api.post("/ai/analyze", {
        resumeId: selectedResume,
        jobDescription,
      });
      setAnalysisResult(response.data);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailor = async (jobTitle: string, company: string) => {
    setIsTailoring(true);
    if (!selectedResume || !jobDescription) return;

    try {
      const response = await api.post("/ai/tailor", {
        resumeId: selectedResume,
        jobDescription,
        jobTitle,
        company,
      });
      // Navigate to tailored resume view using the tailored resume ID
      router.push(`/tailored/${response.data.tailoredResume.id}`);
      setIsTailoring(false);
    } catch (error) {
      console.error("Tailoring failed:", error);
      alert("Tailoring failed");
      setIsTailoring(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-8">
        <div className="grid  gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            {/* Resume Upload Section */}
            <div>
              <Card className="p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">Your Resumes</h2>
                <ResumeUpload onUploadComplete={refetchResumes} />

                <div className=" space-y-2">
                  {resumes?.map((resume: Resume) => (
                    <div
                      key={resume.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedResume === resume.id
                          ? "border-primary-500 bg-primary/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedResume(resume.id)}
                    >
                      <p className="text-sm font-medium">{resume.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Job Description Input */}

            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Job Description</h2>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  disabled={!selectedResume}
                />
              </Card>
            </div>
          </div>
          {analysisResult && (
            <Card className="p-6 mt-6">
              <ATSAnalysis
                result={analysisResult}
                onTailor={handleTailor}
                isTailoring={isTailoring}
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
