"use client";
import ResumeContent from "./resume-content";
import ResumeView from "./resume-view";
import ResumeScores from "./resume-scores";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/use-api-client";

export default function ResumeDetailsPage({ id }: { id: string }) {
  const api = useApiClient();

  const resumeQuery = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const res = await api.get(`/resumes/${id}`);
      return res.data;
    },
  });

  const reviewQuery = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      const res = await api.get(`/resumes/${id}/tailor`);
      return res.data;
    },
  });

  if (resumeQuery.isLoading || reviewQuery.isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (resumeQuery.isError || reviewQuery.isError) {
    return (
      <div className="p-8">
        Error: {resumeQuery.error?.message || reviewQuery.error?.message}
      </div>
    );
  }

  const resume = resumeQuery.data?.data?.resume;
  const review = reviewQuery.data?.data?.review;

  if (!resume || !review) {
    return <div className="p-8">No data available</div>;
  }

  return (
    <div className="grid grid-cols-[0.52fr_1fr_0.4fr]">
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
