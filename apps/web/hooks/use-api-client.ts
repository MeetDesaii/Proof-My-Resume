// hooks/use-api-client.ts
"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createAxiosClient } from "@/lib/axios/api-client";

export function useApiClient() {
  const { getToken } = useAuth();
  const api = useMemo(() => {
    return createAxiosClient({
      getToken: async () => await getToken(),
      onUnauthorized: async () => {
        const returnTo =
          typeof window !== "undefined" ? window.location.href : "/";
        window.location.assign(
          `/sign-in?redirect_url=${encodeURIComponent(returnTo)}`
        );
      },
      requestConfig: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
    });
  }, [getToken]);

  return api;
}
