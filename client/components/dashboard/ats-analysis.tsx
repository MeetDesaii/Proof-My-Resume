/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface ATSAnalysisProps {
  result: {
    atsScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: any;
  };
  onTailor: (jobTitle: string, company: string) => void;
  isTailoring: boolean;
}

export function ATSAnalysis({
  result,
  onTailor,
  isTailoring,
}: ATSAnalysisProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  return (
    <div className="space-y-6">
      {/* ATS Score */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">ATS Compatibility Score</span>
          <span className="text-sm font-bold">{result.atsScore}%</span>
        </div>
        <Progress value={result.atsScore} className="h-3" />
      </div>

      {/* Keywords Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
            Matched Keywords ({result.matchedKeywords?.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.map((keyword, idx) => (
              <Badge key={idx} variant="default" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <XCircle className="w-4 h-4 text-red-500 mr-2" />
            Missing Keywords ({result.missingKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((keyword, idx) => (
              <Badge key={idx} variant="destructive" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Top Suggestions:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {Object.entries(result.suggestions)
                .slice(0, 3)
                .map(([, value], idx) => (
                  <li key={idx} className="text-sm">
                    {value as string}
                  </li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tailor Resume Action */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">
          Ready to Tailor Your Resume?
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
        <Button
          className="w-max mt-4"
          onClick={() => onTailor(jobTitle, company)}
          disabled={true}
        >
          {isTailoring ? "Generating..." : "Generate Tailored Resume"}
        </Button>
      </div>
    </div>
  );
}
