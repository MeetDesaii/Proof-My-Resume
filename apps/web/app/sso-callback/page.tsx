"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    async function handleCallback() {
      await handleRedirectCallback({ redirectUrl: "/" });
    }

    handleCallback();
  }, [handleRedirectCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}
