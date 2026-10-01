"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const team = [
  {
    name: "Godprevail Eseh",
    role: "Software Engineer",
    bio: "Building Mecho at the intersection of AI, language, software and everyday communication.",
    image: "/images/team/team1.jpg",
  },
  {
    name: "Team Member",
    role: "Product & Strategy",
    bio: "Turning real user needs into thoughtful product decisions and simple creative experiences.",
    image: "/images/team/team2.jpg",
  },
  {
    name: "Team Member",
    role: "Creative & Brand",
    bio: "Shaping how Mecho looks, feels and communicates across every part of the brand experience.",
    image: "/images/team/team4.jpg",
  },
  {
    name: "Team Member",
    role: "Prompt Engineer",
    bio: "Designing the intelligence behind how Mecho understands intent, context, tone and multilingual creative direction.",
    image: "/images/team/team3.jpg",
  },
  {
    name: "Team Member",
    role: "UI/UX Designer",
    bio: "Designing intuitive experiences that make powerful AI tools feel natural, clear and enjoyable to use.",
    image: "/images/team/team5.jpg",
  },
];

export function TeamSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const scrollByCard = (direction: "next" | "previous") => {
    const container = carouselRef.current;

    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;

    if (!firstCard) return;

    const gap = 24;

    const amount = firstCard.offsetWidth + gap;

    const reachedEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - amount * 0.5;

    const reachedStart = container.scrollLeft <= amount * 0.5;

    if (direction === "next") {
      if (reachedEnd) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        return;
      }

      container.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }

    if (direction === "previous") {
      if (reachedStart) {
        container.scrollTo({
          left: container.scrollWidth,
          behavior: "smooth",
        });

        return;
      }

      container.scrollBy({
        left: -amount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isInteracting) return;

    const interval = window.setInterval(() => {
      scrollByCard("next");
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isInteracting]);

  return (
    <section
      id="team"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        bg-background
        py-24
        sm:py-28
        lg:scroll-mt-28
        lg:py-32
      "
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-32 top-[12%]
          h-80 w-80
          rounded-full
          bg-mecho-purple/8
          blur-[130px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-32 bottom-[8%]
          h-80 w-80
          rounded-full
          bg-mecho-orange/8
          blur-[130px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="
            flex flex-col
            gap-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="max-w-3xl">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-mecho-purple
              "
            >
              The people behind Mecho
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
                text-foreground
                sm:text-5xl
                lg:text-[3.5rem]
              "
            >
              Built by people
              <br />
              who care how ideas travel.
            </h2>

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-8
                text-muted-foreground
                sm:text-lg
              "
            >
              A multidisciplinary team bringing together engineering, artificial
              intelligence, product thinking, design and communication to shape
              how Mecho works.
            </p>
          </div>

          {/* Desktop carousel controls */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard("previous")}
              aria-label="Previous team members"
              className="
                flex size-11
                items-center justify-center
                rounded-full
                border border-border
                bg-background
                text-foreground
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-mecho-purple/30
                hover:bg-mecho-purple-soft
                hover:text-mecho-purple
              "
            >
              <ArrowLeft className="size-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => scrollByCard("next")}
              aria-label="Next team members"
              className="
                flex size-11
                items-center justify-center
                rounded-full
                border border-border
                bg-background
                text-foreground
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-mecho-purple/30
                hover:bg-mecho-purple-soft
                hover:text-mecho-purple
              "
            >
              <ArrowRight className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* Team carousel */}
        <div className="relative mt-16 sm:mt-20">
          {/* Left edge fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-y-0 left-0
              z-20
              hidden w-10
              bg-gradient-to-r
              from-background
              to-transparent
              lg:block
            "
          />

          {/* Right edge fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-y-0 right-0
              z-20
              hidden w-10
              bg-gradient-to-l
              from-background
              to-transparent
              lg:block
            "
          />

          <div
            ref={carouselRef}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => {
              setIsInteracting(false);
              setActiveMember(null);
            }}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => {
              window.setTimeout(() => {
                setIsInteracting(false);
              }, 1800);
            }}
            className="
              flex
              snap-x
              snap-mandatory
              gap-6
              overflow-x-auto
              scroll-smooth
              pb-4

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {team.map((member, index) => {
              const isActive = activeMember === index;

              return (
                <motion.article
                  key={`${member.name}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(index * 0.05, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() =>
                    setActiveMember((current) =>
                      current === index ? null : index,
                    )
                  }
                  className="
                    group
                    relative
                    aspect-[4/5]
                    min-w-[86%]
                    cursor-pointer
                    snap-start
                    overflow-hidden
                    rounded-[1.8rem]
                    border border-border/70
                    bg-muted

                    sm:min-w-[calc(50%-12px)]

                    lg:min-w-[calc(33.333%-16px)]
                  "
                >
                  {/* Portrait */}
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="
                      object-cover
                      transition-transform
                      duration-[900ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:scale-[1.045]
                    "
                    sizes="
                      (max-width: 640px) 86vw,
                      (max-width: 1024px) 50vw,
                      33vw
                    "
                  />

                  {/* Permanent cinematic bottom gradient */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/35
                      via-black/0
                      to-transparent
                    "
                  />

                  {/* Premium hover tint */}
                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute inset-0
                      bg-gradient-to-t
                      from-[#100817]/95
                      via-[#100817]/55
                      to-[#100817]/5
                      transition-opacity
                      duration-500

                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  />

                  {/* Purple/orange atmosphere */}
                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute -bottom-20 -left-16
                      size-52
                      rounded-full
                      bg-mecho-purple/30
                      blur-[70px]
                      transition-opacity
                      duration-500

                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  />

                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute -right-20 bottom-10
                      size-44
                      rounded-full
                      bg-mecho-orange/15
                      blur-[70px]
                      transition-opacity
                      duration-500

                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  />

                  {/* Team content */}
                  <div
                    className={`
                      absolute
                      inset-x-0 bottom-0
                      z-10
                      p-6
                      text-white
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      sm:p-7

                      ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    {/* Role */}
                    <div className="mb-4 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-mecho-orange" />

                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.17em]
                          text-white/65
                        "
                      >
                        {member.role}
                      </p>
                    </div>

                    {/* Name */}
                    <h3
                      className="
                        text-2xl
                        font-semibold
                        tracking-[-0.04em]
                        text-white
                        sm:text-[1.7rem]
                      "
                    >
                      {member.name}
                    </h3>

                    {/* Divider */}
                    <div
                      className="
                        my-4
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-white/25
                        to-transparent
                      "
                    />

                    {/* Bio */}
                    <p
                      className="
                        max-w-sm
                        text-sm
                        leading-6
                        text-white/65
                        sm:text-[15px]
                        sm:leading-7
                      "
                    >
                      {member.bio}
                    </p>

                    {/* Signature */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px w-7 bg-mecho-orange" />

                      <span
                        className="
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.18em]
                          text-white/45
                        "
                      >
                        Mecho AI
                      </span>
                    </div>
                  </div>

                  {/* Subtle instruction on touch devices */}
                  <div
                    className={`
                      absolute
                      bottom-5 right-5
                      z-10
                      rounded-full
                      border border-white/15
                      bg-black/20
                      px-3 py-1.5
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-white/65
                      backdrop-blur-md
                      transition-opacity
                      duration-300
                      sm:hidden

                      ${isActive ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    Tap to meet
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Mobile controls */}
          <div className="mt-6 flex items-center justify-between sm:hidden">
            <p
              className="
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              Swipe to meet the team
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard("previous")}
                aria-label="Previous team member"
                className="
                  flex size-10
                  items-center justify-center
                  rounded-full
                  border border-border
                  bg-background
                "
              >
                <ArrowLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Next team member"
                className="
                  flex size-10
                  items-center justify-center
                  rounded-full
                  border border-border
                  bg-background
                "
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div
          className="
            mt-12
            flex items-center
            gap-6
            sm:mt-14
          "
        >
          <p
            className="
              shrink-0
              text-sm
              font-medium
              text-muted-foreground
              sm:text-base
            "
          >
            Different disciplines. One shared direction.
          </p>

          <div
            className="
              hidden
              h-px
              flex-1
              bg-gradient-to-r
              from-mecho-purple/40
              via-mecho-orange/30
              to-transparent
              sm:block
            "
          />
        </div>
      </div>
    </section>
  );
}
