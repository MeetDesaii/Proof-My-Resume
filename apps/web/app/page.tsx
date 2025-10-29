import Header from "@/components/header";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Diagonal Fade Grid Background - Top Right */}
      <div
        className="absolute inset-0 z-0 [background-size:32px_32px] [background-image:linear-gradient(to_right,rgb(209_213_219)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_213_219)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(36_46_62)_1px,transparent_1px),linear-gradient(to_bottom,rgb(36_46_62)_1px,transparent_1px)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />

      <div className="relative z-20">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <HeroSection />
      </div>
    </div>
  );
}
