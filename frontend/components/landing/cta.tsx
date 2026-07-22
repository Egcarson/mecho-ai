"use client";

import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-white/5 p-16 text-center backdrop-blur-xl">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-5xl font-extrabold text-white">
              Ready to transform
              <br />
              your next campaign?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Generate multilingual, platform-optimized campaigns in seconds
              with LocalVoice AI.
            </p>

            <Link href="/workspace">
              <Button
                size="lg"
                className="mt-10 rounded-2xl bg-linear-to-r from-violet-600 to-orange-500 px-8 py-6 text-base font-semibold cursor-pointer"
              >
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
