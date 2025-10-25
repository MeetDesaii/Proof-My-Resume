"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@visume/ui/components/tabs";
import { ResumeWithOutJob } from "@visume/types";
import {
  BookMarked,
  Box,
  Briefcase,
  FolderOpenDot,
  GraduationCap,
  LinkIcon,
  LucideProps,
  ScrollText,
  User,
} from "lucide-react";
import ResumeInfoList from "./resume-info-list";
import ResumeSuggestionsList from "./resume-suggestion-list";
import { ResumeReview } from "@visume/types/models/resume-review";

export type Section = {
  name: string;
  id: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export const sections: Section[] = [
  {
    name: "Summary",
    id: "summary",
    icon: ScrollText,
  },
  {
    name: "Personal Info",
    id: "personalInfo",
    icon: User,
  },
  {
    name: "Work Experience",
    id: "workExperience",
    icon: Briefcase,
  },
  {
    name: "Volunteer Experience",
    id: "volunteerExperience",
    icon: Briefcase,
  },
  {
    name: "Education",
    id: "education",
    icon: GraduationCap,
  },
  {
    name: "Certifications",
    id: "certifications",
    icon: BookMarked,
  },
  {
    name: "Skills",
    id: "skills",
    icon: Box,
  },
  {
    name: "Projects",
    id: "projects",
    icon: FolderOpenDot,
  },
  {
    name: "Links",
    id: "links",
    icon: LinkIcon,
  },
];

export default function ResumeContent({
  resume,
  review,
}: {
  resume: ResumeWithOutJob;
  review: ResumeReview;
}) {
  return (
    <div>
      <Tabs defaultValue="info">
        <TabsList className="border-b w-full rounded-none">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="sugggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ResumeInfoList resume={resume} />
        </TabsContent>
        <TabsContent value="sugggestions">
          <ResumeSuggestionsList review={review} resume={resume} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
