"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";

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
  const [activeMember, setActiveMember] = useState<number | null>(null);

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
      {/* Ambient brand canvas */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          animate={{
            x: ["-3%", "4%", "-3%"],
            y: ["0%", "3%", "0%"],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -left-40
            top-[8%]
            h-[380px]
            w-[380px]
            rounded-full
            bg-mecho-purple/8
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: ["3%", "-3%", "3%"],
            y: ["2%", "-2%", "2%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-32
            bottom-[5%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-mecho-orange/8
            blur-[150px]
          "
        />

        <span
          className="
            absolute
            right-[-2rem]
            top-[11%]
            select-none
            text-[6rem]
            font-semibold
            leading-none
            tracking-[-0.09em]
            text-foreground/[0.018]

            sm:text-[9rem]

            lg:text-[12rem]
          "
        >
          PEOPLE
        </span>
      </div>

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* Header */}

        <div
          className="
            grid
            gap-8

            lg:grid-cols-[0.95fr_1.05fr]
            lg:items-end
          "
        >
          <div>
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
                max-w-3xl
                text-4xl
                font-semibold
                leading-[0.98]
                tracking-[-0.06em]

                sm:text-5xl

                lg:text-[4.2rem]
              "
            >
              Different minds.
              <br />
              <span className="text-mecho-gradient">One direction.</span>
            </h2>
          </div>

          <p
            className="
              max-w-xl
              text-base
              leading-8
              text-muted-foreground

              sm:text-lg

              lg:ml-auto
            "
          >
            Engineering, product, intelligence, design and brand — working
            together to shape how Mecho feels.
          </p>
        </div>

        {/* Team grid */}

        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-5

            sm:grid-cols-2

            lg:mt-16
            lg:grid-cols-5
            lg:gap-4
          "
        >
          {team.map((member, index) => (
            <TeamCard
              key={`${member.name}-${index}`}
              member={member}
              active={activeMember === index}
              onToggle={() =>
                setActiveMember((current) => (current === index ? null : index))
              }
              index={index}
            />
          ))}
        </div>

        {/* Closing line */}

        <div
          className="
            mt-12
            flex
            items-center
            gap-5

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

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

function TeamCard({
  member,
  active,
  onToggle,
  index,
}: {
  member: TeamMember;
  active: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
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
        delay: Math.min(index * 0.04, 0.14),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onToggle}
      className="
        group
        relative
        aspect-[4/5]
        cursor-pointer
        overflow-hidden
        rounded-[1.6rem]
        border
        border-border/60
        bg-muted
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
          duration-[1000ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-[1.035]
        "
        sizes="
          (max-width: 640px) 100vw,
          (max-width: 1024px) 50vw,
          20vw
        "
      />

      {/* Permanent light shading */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/25
          via-transparent
          to-transparent
        "
      />

      {/* Overlay */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-[#0b0610]/95
          via-[#0b0610]/72
          to-[#0b0610]/20
          transition-opacity
          duration-500
          ease-out

          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      {/* Subtle Mecho glow inside overlay */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -bottom-16
          -left-16
          size-48
          rounded-full
          bg-mecho-purple/25
          blur-[75px]
          transition-opacity
          duration-500

          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -right-16
          bottom-8
          size-40
          rounded-full
          bg-mecho-orange/15
          blur-[70px]
          transition-opacity
          duration-500

          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      {/* Minimal always-visible label */}

      <div
        className={`
          absolute
          inset-x-0
          bottom-0
          z-10
          p-5
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${active ? "opacity-0" : "opacity-100 group-hover:opacity-0"}
        `}
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.15em]
            text-white/65
          "
        >
          {member.role}
        </p>

        <h3
          className="
            mt-2
            text-xl
            font-semibold
            tracking-[-0.04em]
            text-white
          "
        >
          {member.name}
        </h3>
      </div>

      {/* Hover / tap content */}

      <div
        className={`
          absolute
          inset-x-0
          bottom-0
          z-20
          p-5
          text-white
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            active
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }
        `}
      >
        <div
          className="
            mb-4
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              size-1.5
              rounded-full
              bg-mecho-orange
            "
          />

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white/60
            "
          >
            {member.role}
          </p>
        </div>

        <h3
          className="
            text-2xl
            font-semibold
            tracking-[-0.045em]
          "
        >
          {member.name}
        </h3>

        <div
          className="
            my-4
            h-px
            bg-gradient-to-r
            from-white/25
            to-transparent
          "
        />

        <p
          className="
            text-sm
            leading-6
            text-white/68
          "
        >
          {member.bio}
        </p>

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              h-px
              w-7
              bg-mecho-orange
            "
          />

          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-white/40
            "
          >
            Mecho AI
          </span>
        </div>
      </div>

      {/* Mobile hint */}

      <div
        className={`
          absolute
          right-4
          top-4
          z-20
          rounded-full
          border
          border-white/15
          bg-black/15
          px-2.5
          py-1.5
          text-[9px]
          font-medium
          uppercase
          tracking-[0.13em]
          text-white/60
          backdrop-blur-md
          transition-opacity

          sm:hidden

          ${active ? "opacity-0" : "opacity-100"}
        `}
      >
        Tap
      </div>
    </motion.article>
  );
}
