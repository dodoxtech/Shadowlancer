import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { PhilosophySection } from "@/components/landing/PhilosophySection";
import { BentoPreview } from "@/components/landing/BentoPreview";
import { ImageGallery } from "@/components/landing/ImageGallery";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex-1">
        <HeroSection />
        <PhilosophySection />
        <BentoPreview />
        <ImageGallery />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
