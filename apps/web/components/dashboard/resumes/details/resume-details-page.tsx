import { ResumeWithOutJob } from "@visume/types";
import React from "react";
import ResumeContent from "./resume-content";
import ResumeView from "./resume-view";
import ResumeScores from "./resume-scores";
import { ResumeReview } from "@visume/types/models/resume-review";

export default function ResumeDetailsPage({
  resume,
  review,
}: {
  resume: ResumeWithOutJob;
  review: ResumeReview;
}) {
  return (
    <div className="grid grid-cols-[0.4fr_1fr_0.45fr]">
      <div className="border min-h-[calc(100vh_-_49px)]">
        <ResumeContent resume={resume} review={review} />
      </div>
      <div className="border  min-h-[calc(100vh_-_49px)]">
        <ResumeView resume={resume} />
      </div>
      <div className="border min-h-[calc(100vh_-_49px)]">
        <ResumeScores resumeScore={resume.resumeScore} />
      </div>
    </div>
  );
}
