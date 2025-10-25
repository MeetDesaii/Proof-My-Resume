import { Suggestions } from "./suggestions";

export enum ResumeReviewStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export interface ResumeReview {
  owner: string;
  resume: string;
  _id: string;

  summary: string;
  status: ResumeReviewStatus;
  startedAt: Date;
  finishedAt: Date;

  suggestions: Suggestions[];
}
