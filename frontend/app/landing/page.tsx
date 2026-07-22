import Background from "@/components/welcome/background";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/Footer";
import PageWrapper from "@/components/shared/PageWrapper";
import Navbar from "@/components/landing/Navbar";

export default function LandingPage() {
  return (
    <PageWrapper>
      <Background />

      <div className="relative z-10  inset-0 ">
        <Navbar />
        <Hero />
        <HowItWorks />
        <Features />
        <CTA />
        <Footer />
      </div>
    </PageWrapper>
  );
}
