import { ResumeDTO, ResumeScoreDTO } from "@visume/types";
import { Label } from "@visume/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@visume/ui/components/tabs";
import { Progress } from "@visume/ui/components/progress";
import { Briefcase, PlusSquare, Verified } from "lucide-react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@visume/ui/components/popover";
import { Badge } from "@visume/ui/components/badge";

export default function ResumeScores({
  resumeScore,
}: {
  resumeScore: ResumeScoreDTO;
}) {
  return (
    <Tabs defaultValue="job">
      <TabsList className="border-b w-full rounded-none">
        <TabsTrigger value="job">
          <Briefcase /> Job
        </TabsTrigger>
        <TabsTrigger value="overallScore">
          <Verified /> Overall score
        </TabsTrigger>
      </TabsList>
      <TabsContent value="job">
        <div className="p-4 space-y-3 border-b">
          <div className="flex justify-between items-center">
            <Label>Job Match</Label>
            <Label>{resumeScore.score * 100}%</Label>
          </div>
          <Progress value={resumeScore.score * 100} />
        </div>

        <div className="px-4 py-4 border-b cursor-pointer flex justify-between items-center group hover:bg-accent/30">
          <div className="flex gap-4 w-full justify-between">
            <p className="text-neutral-600 group-hover:text-black">
              Section Completion
            </p>
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              {resumeScore.sectionCompletion.score * 100}%
            </Badge>
          </div>
        </div>
        <div className="px-4 py-4 border-b cursor-pointer flex justify-between items-center group hover:bg-accent/30">
          <div className="flex gap-4 w-full justify-between">
            <p className="text-neutral-600 group-hover:text-black">
              Content Length
            </p>
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              {resumeScore.contentLength.score * 100}%
            </Badge>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="overallScore"></TabsContent>
    </Tabs>
  );
}
