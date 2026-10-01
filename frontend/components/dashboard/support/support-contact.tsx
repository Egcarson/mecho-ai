"use client";

import { Mail, Send } from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

import { SUPPORT_EMAIL } from "./support-data";

type ContactCategory =
  | "General"
  | "Content generation"
  | "Image generation"
  | "Voice generation"
  | "Projects & Library"
  | "Account"
  | "Technical issue";

/**
 * No support API exists yet.
 *
 * For now this component prepares a structured mailto link rather than
 * pretending a ticket was submitted.
 *
 * When a support endpoint is introduced later, this component is the
 * main file that should change.
 */
export function SupportContact() {
  const [subject, setSubject] = useState("");

  const [category, setCategory] = useState<ContactCategory>("General");

  const [message, setMessage] = useState("");

  function handleContact() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Tell us what happened.", {
        description: "Add a subject and message before contacting support.",
      });

      return;
    }

    /**
     * Helpful debugging context is generated automatically.
     *
     * Avoid sending sensitive account data here.
     * Current path + timestamp are enough to give support useful context.
     */
    const currentPage =
      typeof window !== "undefined"
        ? window.location.pathname
        : "/dashboard/support";

    const timestamp = new Date().toISOString();

    const body = [
      `Category: ${category}`,
      "",
      message.trim(),
      "",
      "--------------------",
      "Mecho context",
      `Page: ${currentPage}`,
      `Time: ${timestamp}`,
    ].join("\n");

    const mailto =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(`[Mecho Support] ${subject.trim()}`)}` +
      `&body=${encodeURIComponent(body)}`;

    /**
     * mailto delegates sending to the user's installed/default email app.
     * Nothing is stored by Mecho at this stage.
     */
    window.location.href = mailto;
  }

  return (
    <section
      className="
        relative
        mt-16
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/60
        bg-background/85
        p-5
        shadow-[0_24px_80px_rgba(47,1,117,0.05)]
        backdrop-blur-xl

        sm:p-7

        lg:p-8
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-48
          rounded-full
          bg-mecho-orange/8
          blur-[75px]
        "
      />

      <div
        className="
          relative

          lg:grid
          lg:grid-cols-[0.8fr_1.2fr]
          lg:gap-12
        "
      >
        <div>
          <div
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-2xl
              bg-mecho-purple-soft
              text-mecho-purple
            "
          >
            <Mail className="size-5" />
          </div>

          <p
            className="
              mt-5
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-mecho-purple
            "
          >
            Still need help?
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.04em]

              sm:text-3xl
            "
          >
            Contact Mecho Support.
          </h2>

          <p
            className="
              mt-3
              max-w-md
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            Tell us what happened and include enough detail for us to understand
            the issue.
          </p>

          <p
            className="
              mt-5
              text-xs
              text-muted-foreground
            "
          >
            This currently opens your email app. A direct in-app support system
            can replace it when the support API is ready.
          </p>
        </div>

        <div
          className="
            mt-8
            space-y-4

            lg:mt-0
          "
        >
          <Field
            label="Subject"
            value={subject}
            placeholder="Briefly describe the issue"
            onChange={setSubject}
          />

          <label className="block">
            <span
              className="
                text-xs
                font-semibold
              "
            >
              Category
            </span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ContactCategory)
              }
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                border
                border-border/70
                bg-background
                px-3.5
                text-sm
                outline-none

                focus:border-mecho-purple/40
              "
            >
              <option>General</option>

              <option>Content generation</option>

              <option>Image generation</option>

              <option>Voice generation</option>

              <option>Projects & Library</option>

              <option>Account</option>

              <option>Technical issue</option>
            </select>
          </label>

          <label className="block">
            <span
              className="
                text-xs
                font-semibold
              "
            >
              Describe the issue
            </span>

            <textarea
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What were you trying to do, and what happened?"
              className="
                mt-2
                w-full
                resize-none
                rounded-2xl
                border
                border-border/70
                bg-background
                px-4
                py-3
                text-sm
                leading-6
                outline-none

                placeholder:text-muted-foreground/60

                focus:border-mecho-purple/40
              "
            />
          </label>

          <div
            className="
              flex
              justify-end
            "
          >
            <button
              type="button"
              onClick={handleContact}
              className="
                inline-flex
                h-11
                items-center
                gap-2
                rounded-full
                bg-mecho-gradient
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_28px_rgba(111,44,255,0.18)]
                transition-all

                hover:-translate-y-0.5
              "
            >
              <Send className="size-4" />
              Contact support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span
        className="
          text-xs
          font-semibold
        "
      >
        {label}
      </span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          h-11
          w-full
          rounded-xl
          border
          border-border/70
          bg-background
          px-3.5
          text-sm
          outline-none

          placeholder:text-muted-foreground/60

          focus:border-mecho-purple/40
        "
      />
    </label>
  );
}
