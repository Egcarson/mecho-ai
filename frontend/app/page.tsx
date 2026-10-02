"use client";

import { Navbar } from "@/components/landing/navbar";

import { Hero } from "@/components/landing/hero";

import { CoreMessage } from "@/components/landing/core-message";

import { AboutSection } from "@/components/landing/about-section";

import { TeamSection } from "@/components/landing/team-section";

import { ContactSection } from "@/components/landing/contact-section";

import { FinalCta } from "@/components/landing/final-cta";

import { Footer } from "@/components/landing/footer";
import { useEffect, useState } from "react";
import { MechoLoader } from "@/components/brand/page-loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <MechoLoader visible={loading} />

      <main
        className="
        min-h-screen
        overflow-x-hidden
        bg-background
        text-foreground
      "
      >
        <Navbar />

        <Hero />

        <CoreMessage />

        <AboutSection />

        <TeamSection />

        <FinalCta />

        <ContactSection />

        <Footer />
      </main>
    </>
  );
}
