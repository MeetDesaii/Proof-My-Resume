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

import { getServerApiClient } from "@/lib/axios/server";
import { ResumeDTO } from "@visume/types";
import { redirect } from "next/navigation";

async function getUserResume() {
  const api = getServerApiClient();

  const res = await api.get(`/resumes`);

  return res.data;
}

export default async function page() {
  const { data } = await getUserResume();
  // const resumes = await prisma.resume.findMany({
  //   where: { ownerUserId: session.user.id as string },
  //   orderBy: { createdAt: "desc" },
  // });
  const resumes: ResumeDTO[] = data.resumes;

  if (!resumes || resumes.length === 0) {
    redirect("/initial");
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
              You haven't added any resumes yet. Get started by uploading your
              first resume.
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
