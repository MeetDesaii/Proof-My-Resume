"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createAxiosClient } from "@/lib/axios/api-client";
import { useRouter } from "next/navigation";

export function useApiClient() {
  const { getToken } = useAuth();
  const router = useRouter();
  const api = useMemo(() => {
    return createAxiosClient({
      getToken: async () => await getToken(),
      onUnauthorized: async () => {
        const returnTo =
          typeof window !== "undefined" ? window.location.href : "/";
        router.push(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
      },
      requestConfig: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
    });
  }, [getToken, router]);

  return api;
}
