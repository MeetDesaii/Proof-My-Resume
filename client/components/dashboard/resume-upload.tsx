"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { resumeAPI } from "@/lib/api";

interface ResumeUploadProps {
  onUploadComplete?: () => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      await resumeAPI.upload(file);
      toast.success("Resume uploaded successfully");
      setFileName(null);
      onUploadComplete?.();
    } catch (error) {
      console.error("Resume upload failed", error);
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
        <p className="text-sm text-gray-600">
          Upload your resume in PDF or DOCX format to get started.
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Select File"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {fileName && (
        <p className="text-sm text-gray-500">
          Selected file: <span className="font-medium">{fileName}</span>
        </p>
      )}
    </div>
  );
}
