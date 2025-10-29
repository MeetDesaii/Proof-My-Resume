// lib/axios/server.ts
import { auth } from "@clerk/nextjs/server";
import { createAxiosClient } from "./api-client";

export function getServerApiClient() {
  const api = createAxiosClient({
    getToken: async () => {
      const { getToken } = await auth();
      return await getToken();
    },
    onUnauthorized: async () => {
      console.log("User is not authenticated");
    },
  });

  return api;
}
