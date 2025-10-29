"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@visume/ui/components/button";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      {/* Diagonal Fade Grid Background */}
      <div
        className="absolute inset-0 z-0 [background-size:32px_32px] [background-image:linear-gradient(to_right,rgb(209_213_219)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_213_219)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(55_65_81)_1px,transparent_1px),linear-gradient(to_bottom,rgb(55_65_81)_1px,transparent_1px)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 50%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 50%)",
        }}
      />

      <div className="relative z-20 container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Something Went Wrong
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error. Don&apos;t worry, our team has
              been notified and we&apos;re working on it.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-left max-w-xl mx-auto">
                <p className="text-sm font-mono text-destructive break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => reset()}
            >
              <RefreshCcw />
              Try Again
            </Button>
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please contact support or try again
              later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
