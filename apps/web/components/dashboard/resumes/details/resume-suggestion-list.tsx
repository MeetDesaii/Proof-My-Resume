"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@visume/ui/components/empty";
import { Sparkles } from "lucide-react";
import { Button } from "@visume/ui/components/button";
import { ResumeReview } from "@visume/types/models/resume-review";
import { Label } from "@visume/ui/components/label";
import { ScrollArea } from "@visume/ui/components/scroll-area";
import { Badge } from "@visume/ui/components/badge";
import { sortSuggestions } from "@/lib/sortSuggestions";
import { cn } from "@visume/ui/lib/utils";
import { ResumeWithOutJob } from "@visume/types";
import TailorResume from "./tailor-resume";
import { Separator } from "@visume/ui/components/separator";

export default function ResumeSuggestionsList({
  review,
  resume,
}: {
  review: ResumeReview;
  resume: ResumeWithOutJob;
}) {
  console.log("🚀 ~ ResumeSuggestionsList ~ review:", review);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  if (Object.keys(review).length === 0)
    return (
      <div className="grid place-content-center h-[calc(100vh_-_300px)]">
        <Empty>
          <EmptyHeader>
            <EmptyTitle className="text-xl font-semibold">
              AI Job Tailoring
            </EmptyTitle>
            <EmptyDescription>
              You haven&apos;t tailored your resume yet. Get suggestions by
              tailoring your resume.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <TailorResume resume={resume} review={review} />
          </EmptyContent>
        </Empty>
      </div>
    );

  const sortedSuggestion = sortSuggestions(review.suggestions, {
    sortItems: true,
  });

  return (
    <ScrollArea className="h-screen pb-30">
      <div className="">
        <div className="border-y  py-2 px-4 flex items-center text-primary bg-primary/10 justify-between">
          <Label>
            <Sparkles className="size-4 text-primary" />
            AI Review
          </Label>

          <button
            type="button"
            className="font-medium cursor-pointer"
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          >
            {isSummaryExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        {!isSummaryExpanded ? (
          <div
            className="text-sm! space-y-3 px-3 p-4 cursor-pointer bg-primary/5"
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          >
            <p>{review.summary.slice(0, 200)}</p>...
          </div>
        ) : (
          <div className="text-sm! space-y-3 px-3 p-4 bg-primary/5">
            <ReactMarkdown>{review.summary}</ReactMarkdown>
          </div>
        )}
      </div>
      {sortedSuggestion.map((sugg) => (
        <div key={sugg.sectionName} className="space-y-3">
          <Label className="border-y  py-2 px-4 flex items-center">
            <sugg.icon className="size-5" />
            {sugg.sectionName}
          </Label>
          {sugg.items.map((item) => (
            <div
              className={cn(
                "py-4 px-3 rounded-md shadow-sm border mx-3 mb-3 transition-all ease-out",
                item.priority === "RECOMMENDED"
                  ? "bg-primary/10 hover:bg-primary/30 hover:ring-primary ring-2 ring-transparent"
                  : "bg-destructive/15 hover:bg-destructive/30 hover:ring-destructive ring-2 ring-transparent"
              )}
              key={item._id}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-black/70">
                  {item.title}
                </h4>
                <Badge
                  size="sm"
                  variant="outline"
                  className={cn(
                    item.priority === "RECOMMENDED"
                      ? "border-primary/40 text-primary"
                      : "border-destructive/40 text-destructive"
                  )}
                >
                  {item.priority}
                </Badge>
              </div>
              <p className="text-sm mt-3.5 text-neutral-700 ">
                {item.description}
              </p>

              {/* <div>{resume[item.path]}</div> */}
              <Separator
                className={cn(
                  "my-4",
                  item.priority === "RECOMMENDED"
                    ? "bg-primary/50 "
                    : "bg-destructive/50 "
                )}
              />
              <div className="space-y-4">
                {item.operation.actual && item.operation.actual !== "" ? (
                  <div>
                    <Label className="mb-2">Actual</Label>
                    <span className="text-sm line-through ">
                      {item.operation.actual}
                    </span>
                  </div>
                ) : null}
                {item.operation.value && item.operation.value !== "" ? (
                  <div>
                    <Label className="mb-2">
                      {item.operation.action === "REPLACE"
                        ? "Replace"
                        : item.operation.action === "ADD"
                          ? "Add"
                          : "Remove"}
                    </Label>
                    <span className="text-sm">{item.operation.value}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </ScrollArea>
  );
}
