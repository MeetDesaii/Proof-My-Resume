import ResumeDetailsPage from "@/components/dashboard/resumes/details/resume-details-page";
import { getServerApiClient } from "@/lib/axios/server";
import {
  ResumeDetailsResponse,
  ResumeDTO,
  ResumeReviewResponse,
} from "@visume/types";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getResume(id: string): Promise<ResumeDetailsResponse> {
  const api = getServerApiClient();

  const res = await api.get(`/resumes/${id}`);

  return res.data;
}

async function getReview(id: string): Promise<ResumeReviewResponse> {
  const api = getServerApiClient();

  const res = await api.get(`/resumes/${id}/tailor`);

  return res.data;
}

export default async function ResumeDetails({ params }: Props) {
  const { id } = await params;
  const { data } = await getResume(id);
  const { data: reviewData } = await getReview(id);

  const resume = data.resume;
  const review = reviewData.review;

  return <ResumeDetailsPage resume={resume} key={resume._id} review={review} />;
}
