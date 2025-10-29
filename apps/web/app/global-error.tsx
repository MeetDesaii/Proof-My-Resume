"use client";

import { useEffect } from "react";
import { Button } from "@visume/ui/components/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full relative flex items-center justify-center bg-background">
          {/* Diagonal Fade Grid Background */}
          <div
            className="absolute inset-0 z-0 [background-size:32px_32px] [background-image:linear-gradient(to_right,rgb(209_213_219)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_213_219)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(55_65_81)_1px,transparent_1px),linear-gradient(to_bottom,rgb(55_65_81)_1px,transparent_1px)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, #000 50%, transparent 90%)",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, #000 50%, transparent 90%)",
            }}
          />

          <div className="relative z-20 container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                  Critical Error
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  A critical error occurred while loading the application.
                  Please try refreshing the page.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-left max-w-xl mx-auto">
                    <p className="text-sm font-mono text-red-900 dark:text-red-200 break-all">
                      {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Error ID: {error.digest}
                      </p>
                    )}
                    {error.stack && (
                      <details className="mt-4">
                        <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                          Stack Trace
                        </summary>
                        <pre className="text-xs mt-2 overflow-x-auto text-red-900 dark:text-red-200">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => reset()}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => (window.location.href = "/")}
                >
                  Reload Page
                </Button>
              </div>

              {/* Help Text */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If this problem persists, please clear your browser cache or
                  contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
