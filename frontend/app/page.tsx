import { Hero } from "@/components/landing/hero";
import { AudienceStrip } from "@/components/landing/audience-strip";
import { MessageExpansion } from "@/components/landing/message-expansion";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductSection } from "@/components/landing/product-section";
import { AboutSection } from "@/components/landing/about-section";
import { TeamSection } from "@/components/landing/team-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { ContactSection } from "@/components/landing/contact-section";
import { Footer } from "@/components/landing/footer";
import { MechoLoader } from "@/components/brand/page-loader";
import { Navbar } from "@/components/landing/navbar";

export default function Home() {
  return (
    <>
      <MechoLoader />
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Hero />
        <AudienceStrip />
        <MessageExpansion />
        <HowItWorks />

        <ProductSection />

        <AboutSection />

        <TeamSection />

        <FinalCTA />

        <ContactSection />

        <Footer />

        {/* <section className="min-h-screen" /> */}
      </main>
    </>
  );
}
