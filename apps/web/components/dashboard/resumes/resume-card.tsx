"use client";

import { ResumeDTO } from "@visume/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@visume/ui/components/card";
import { File } from "lucide-react";
import Link from "next/link";

export default function ResumeCard({ resume }: { resume: ResumeDTO }) {
  return (
    <Link
      href={`/dashboard/resumes/${resume._id}/editor`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Card className="hover:shadow-xl cursor-pointer hover:-translate-y-1 transition-all border-2 hover:border-primary/30 max-h-[350px]">
        <CardHeader className="overflow-hidden">
          {/* <PDFViewer
            url={resume.metadata.publicUrl}
            useProxy
            className="pointer-events-none"
          /> */}
          <File size={30} className="text-primary" />
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1.5 ">
            <CardTitle className="text-xl">{resume.resumeName}</CardTitle>
            <CardDescription>{resume.sourceInfo.resumeName}</CardDescription>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
