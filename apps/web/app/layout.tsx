import "@visume/ui/globals.css";
import { RootLayoutProviders } from "@/components/providers/root-layout-providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${rubik.className} antialiased `}>
          <RootLayoutProviders>{children}</RootLayoutProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
