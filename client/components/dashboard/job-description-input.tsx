"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface JobDescriptionInputProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  onAnalyze,
  disabled = false,
  isAnalyzing = false,
}: JobDescriptionInputProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-64 w-full resize-none rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Paste the job description here..."
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Provide a detailed job description to receive a tailored analysis of
          your resume.
        </p>
        <Button onClick={onAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>
    </div>
  );
}
