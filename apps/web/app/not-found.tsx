"use client";
import Link from "next/link";
import { Button } from "@visume/ui/components/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
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
          {/* 404 Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-destructive">!</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved or deleted.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              You might find these helpful:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dashboard"
                className="text-sm text-primary hover:underline"
              >
                Dashboard
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/sign-in"
                className="text-sm text-primary hover:underline"
              >
                Sign In
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/sign-up"
                className="text-sm text-primary hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
