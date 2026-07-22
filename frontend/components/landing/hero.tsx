"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { storage } from "@/lib/Storage";
import { getGreeting } from "@/lib/greeting";
import { useEffect, useState } from "react";

export default function Hero() {
  const [name, setName] = useState("Creator");

  useEffect(() => {
    const storedName = storage.getName();

    if (storedName) {
      setName(storedName);
    }
  }, []);
  const greeting = getGreeting();
  const capitalized =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <section className="relative py-24">
      {/* <div className="absolute inset-0 -z-10 overflow-hidden"></div> */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 lg:flex-row lg:px-8 ">
        {/* Left */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-6 text-lg font-medium text-violet-300">
              {greeting}, {capitalized} 👋
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-white lg:text-7xl">
              Create
              <span className="bg-linear-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
                {" "}
                AI-powered
              </span>
              <br />
              multilingual campaigns
              <br />
              that connect.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300">
              Transform PDFs, campaign briefs, and ideas into engaging content
              tailored for every platform, audience, and language—all powered by
              AI.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/workspace">
                <Button
                  size="lg"
                  className="h-14 gap-2 rounded-2xl px-8 text-base font-semiboldh-14  bg-linear-to-r from-violet-600 to-purple-500 cursor-pointer"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl border-violet-500/40 bg-white/5 px-8 text-white hover:bg-white/80 cursor-pointer"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="rounded-3xl border border-violet-500/30 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(124,58,237,0.25)]">
            <div className="space-y-5">
              {[
                "Instagram Campaign ✓",
                "Facebook Campaign ✓",
                "LinkedIn Post ✓",
                "X Thread ✓",
                "TikTok Script ✓",
                "WhatsApp Broadcast ✓",
                "Email Newsletter ✓",
                "Language: Yoruba",
                "Tone: Professional",
                "Audience: Students",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
