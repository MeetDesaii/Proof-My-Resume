"use client";

import { Button } from "@visume/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@visume/ui/components/empty";
import Link from "next/link";
import { File, Plus } from "lucide-react";
import ResumeCard from "@/components/dashboard/resumes/resume-card";

import { ResumeDTO } from "@visume/types";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/use-api-client";
import { useQuery } from "@tanstack/react-query";

export default function ResumesPage() {
  const api = useApiClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["resumes-list"],
    queryFn: async () => {
      const res = await api.get(`/resumes`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto w-full max-w-7xl mt-10">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto w-full max-w-7xl mt-10">
        Error: {error.message}
      </div>
    );
  }

  const resumes: ResumeDTO[] = data?.data?.resumes || [];

  if (resumes.length === 0) {
    router.push("/initial");
  }

  return (
    <section className="container mx-auto w-full max-w-7xl mt-10">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl">My Resumes</h2>
        {/* <ResumeUploadDialog /> */}

        {resumes.length !== 0 && (
          <Link href="/initial">
            <Button>
              <Plus />
              Create new resume
            </Button>
          </Link>
        )}
      </div>

      {resumes.length !== 0 ? (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard resume={resume} key={resume._id} />
          ))}
        </div>
      ) : (
        <Empty className="mt-10">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-secondary ">
              <File />
            </EmptyMedia>
            <EmptyTitle>No Resumes</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t added any resumes yet. Get started by uploading
              your first resume.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus />
              Add Resume
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}
