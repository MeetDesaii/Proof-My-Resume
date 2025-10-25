"use client";

import JobForm from "@/components/initial/job-form";
import ProccessScreen from "@/components/initial/proccess-screen";
import ResumeUpload from "@/components/initial/resume-upload";
import { useState } from "react";
import type { SetupProgress, InitialSetupDetails } from "@visume/types/web";
import { Button } from "@visume/ui/components/button";
import { useAuth } from "@clerk/nextjs";

export default function InitialSetupPage() {
  const [resumeAndJobDetails, setResumeAndJobDetails] =
    useState<InitialSetupDetails>({} as InitialSetupDetails);
  console.log(
    "🚀 ~ InitialSetupPage ~ resumeAndJobDetails:",
    resumeAndJobDetails
  );

  const [progress, setProgress] = useState<SetupProgress>({
    step: 1,
    form: "JOB_FORM",
    hasCompleted: [],
  });

  function handleProgress(step: number, form: SetupProgress["form"]) {
    setProgress({
      step,
      form,
      hasCompleted: [...progress.hasCompleted, form],
    });
  }

  function handleResumeAndJobDetails({ resume, job }: InitialSetupDetails) {
    setResumeAndJobDetails({
      resume: resume ? resume : resumeAndJobDetails.resume,
      job: job ? job : resumeAndJobDetails.job,
    });
  }

  return (
    <div>
      <nav className="px-10 py-3">
        <h3 className="text-xl font-bold text-primary ">Visume AI</h3>
      </nav>
      <div className="max-w-xl grid place-content-center   min-h-[calc(100vh_-_200px)] space-y-10 container mx-auto">
        {/* <div className="flex  gap-3">
          <Button
            variant={progress.step === 1 ? "default" : "secondary"}
            onClick={() => handleProgress(1, "JOB_FORM")}
          >
            1
          </Button>
          <Button
            variant={progress.step === 2 ? "default" : "secondary"}
            onClick={() => handleProgress(2, "RESUME_UPLOAD_FORM")}
          >
            2
          </Button>
          <Button
            variant={progress.step === 3 ? "default" : "secondary"}
            onClick={() => handleProgress(3, "COMPLETED")}
          >
            3
          </Button>
        </div> */}
        <div>
          {progress.form === "JOB_FORM" && (
            <JobForm
              handleProgress={handleProgress}
              handleResumeAndJobDetails={handleResumeAndJobDetails}
            />
          )}
          {progress.form === "RESUME_UPLOAD_FORM" && (
            <ResumeUpload
              handleProgress={handleProgress}
              handleResumeAndJobDetails={handleResumeAndJobDetails}
            />
          )}
        </div>

        {progress.form === "COMPLETED" && (
          <ProccessScreen resumeAndJobDetails={resumeAndJobDetails} />
        )}
      </div>
    </div>
  );
}
