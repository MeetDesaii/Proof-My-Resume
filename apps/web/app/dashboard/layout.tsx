import DashboardProvider from "@/components/providers/dashboard-provider";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect("/sign-in");
  }
  return <DashboardProvider>{children}</DashboardProvider>;
}
