"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@visume/ui/components/tabs";
import { ResumeReview, ResumeWithOutJob } from "@visume/types";
import { Sparkles, Text } from "lucide-react";
import ResumeInfoList from "./resume-info-list";
import ResumeSuggestionsList from "./resume-suggestion-list";
import {
  Icon,
  IconBlocks,
  IconBooks,
  IconBriefcase,
  IconBriefcase2,
  IconBubbleText,
  IconCertificate,
  IconFolder,
  IconLink,
  IconProps,
  IconUser,
} from "@tabler/icons-react";

export type Section = {
  name: string;
  id: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
};

export const sections: Section[] = [
  {
    name: "Summary",
    id: "summary",
    icon: IconBubbleText,
  },
  {
    name: "Personal Info",
    id: "personalInfo",
    icon: IconUser,
  },
  {
    name: "Work Experience",
    id: "workExperience",
    icon: IconBriefcase2,
  },
  {
    name: "Volunteer Experience",
    id: "volunteerExperience",
    icon: IconBriefcase,
  },
  {
    name: "Education",
    id: "education",
    icon: IconBooks,
  },
  {
    name: "Certifications",
    id: "certifications",
    icon: IconCertificate,
  },
  {
    name: "Skills",
    id: "skills",
    icon: IconBlocks,
  },
  {
    name: "Projects",
    id: "projects",
    icon: IconFolder,
  },
  {
    name: "Links",
    id: "links",
    icon: IconLink,
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
          <TabsTrigger value="info">
            <Text />
            Information
          </TabsTrigger>
          <TabsTrigger value="sugggestions">
            <Sparkles />
            Suggestions
          </TabsTrigger>
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
