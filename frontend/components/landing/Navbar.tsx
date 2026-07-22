"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import Logo from "@/components/welcome/logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <Container>
        <nav className="mt-5 flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/5">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo compact />
          </Link>

          {/* Navigation */}
          <div className="hidden items-center lg:flex gap-8 text-sm font-medium text-gray-300 md:flex">
            <Link href="/landing" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/workspace" className="transition hover:text-white">
              Workspace
            </Link>

            {/* CTA */}
            <Link href="/workspace">
              <Button className="rounded-xl bg-linear-to-r from-violet-600 to-orange-500 px-5 text-white hover:opacity-90 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
