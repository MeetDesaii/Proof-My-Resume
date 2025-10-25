"use client";

import { ResumeDTO, ResumeWithOutJob } from "@visume/types";
import React from "react";
import { ResumeTextPreview } from "./resume-text-preview";
import { ScrollArea } from "@visume/ui/components/scroll-area";

export default function ResumeView({ resume }: { resume: ResumeWithOutJob }) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-13 border-b bg-muted flex items-center px-4">
        <div className="font-bold">
          {resume.job.company.name} - {resume.job.title}
        </div>
      </div>

      <ScrollArea className="h-screen pb-30">
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <ResumeTextPreview text={resume.sourceInfo.rawText} />
        </div>
      </ScrollArea>
    </div>
  );
}
