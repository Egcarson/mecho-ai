"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthUser } from "@/types/auth";

type LoginData = {
  email: string;
  password: string;
};

type LoginClientResponse = {
  user: AuthUser;
};

const steps = [
  {
    key: "email" as const,
    eyebrow: "Welcome back",
    title: "What’s your email?",
    description: "Let’s find your Mecho workspace.",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "password" as const,
    eyebrow: "Almost there",
    title: "Enter your password.",
    description: "Your projects and ideas are waiting for you.",
    placeholder: "Enter your password",
    type: "password",
    autoComplete: "current-password",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const { user, loading, refreshUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const currentStep = steps[step];
  const currentValue = formData[currentStep.key];
  const isLastStep = step === steps.length - 1;

  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-mecho-purple" />
      </main>
    );
  }

  if (user) {
    return null;
  }

  function updateCurrentValue(value: string) {
    setError("");

    setFormData((current) => ({
      ...current,
      [currentStep.key]: value,
    }));
  }

  function validateCurrentStep() {
    const value = currentValue.trim();

    if (!value) {
      toast.error("Just one thing first", {
        description: "Fill in this field so we can keep going.",
      });

      return false;
    }

    if (
      currentStep.key === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      toast.error("That email doesn’t look right", {
        description: "Enter a valid email address and try again.",
      });

      return false;
    }

    setError("");
    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    setStep(1);
    setShowPassword(false);
  }

  function previousStep() {
    setError("");
    setStep(0);
    setShowPassword(false);
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // Extra safeguard:
    // registration must NEVER happen before the final step.
    if (!isLastStep) {
      nextStep();
      return;
    }

    if (!validateCurrentStep()) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "The email or password you entered is incorrect.",
        );
      }

      console.log("NEXT LOGIN RESPONSE:", data);

      await refreshUser();

      toast.success("Welcome back", {
        description: "Your Mecho workspace is ready.",
      });

      // We'll handle tokens/session after confirming
      // the exact backend response structure.

      router.replace("/dashboard");
    } catch (error) {
      toast.error("We couldn’t sign you in", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div className="w-full">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>

          <div
            className="
              h-1 w-full
              overflow-hidden
              rounded-full
              bg-muted
            "
          >
            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                h-full
                rounded-full
                bg-mecho-gradient
              "
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            event.preventDefault();

            if (isSubmitting) return;

            if (isLastStep) {
              event.currentTarget.requestSubmit();
              return;
            }

            nextStep();
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{
                opacity: 0,
                x: 22,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Prompt */}
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
                  {currentStep.eyebrow}
                </p>

                <h1
                  className="
                    mt-4
                    text-4xl
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.045em]
                    text-foreground
                    sm:text-5xl
                  "
                >
                  {currentStep.title}
                </h1>

                <p
                  className="
                    mt-4
                    max-w-lg
                    text-base
                    leading-7
                    text-muted-foreground
                  "
                >
                  {currentStep.description}
                </p>
              </div>

              {/* One input */}
              <div className="mt-9">
                <div className="relative">
                  <Input
                    autoFocus
                    type={
                      currentStep.type === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : currentStep.type
                    }
                    name={currentStep.key}
                    value={currentValue}
                    onChange={(event) => updateCurrentValue(event.target.value)}
                    placeholder={currentStep.placeholder}
                    autoComplete={currentStep.autoComplete}
                    className={`
                      h-14
                      rounded-2xl
                      border-border/80
                      bg-background
                      px-5

                      text-[17px]
                      font-medium
                      tracking-[-0.01em]

                      placeholder:text-[17px]
                      placeholder:font-normal
                      placeholder:text-muted-foreground/60

                      shadow-[0_8px_30px_rgba(47,1,117,0.04)]

                      transition-all
                      duration-300

                      focus-visible:border-mecho-purple/50
                      focus-visible:ring-mecho-purple/15

                      ${currentStep.type === "password" ? "pr-12" : ""}
                    `}
                  />

                  {currentStep.type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="
                        absolute
                        right-4 top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                        text-sm font-medium
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="size-[18px]" />
                      ) : (
                        <Eye className="size-[18px]" />
                      )}
                    </button>
                  )}
                </div>

                {/* Forgot password */}
                {currentStep.key === "password" && (
                  <div className="mt-4 flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="
                        text-sm
                        font-medium
                        text-mecho-purple
                        transition-opacity
                        hover:opacity-75
                      "
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -3,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                        mt-3
                        text-sm
                        font-medium
                        text-destructive
                      "
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div
                className="
                  mt-9
                  flex items-center
                  justify-between
                  gap-4
                "
              >
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={previousStep}
                    className="
                      rounded-full
                      px-3
                      text-muted-foreground
                      hover:bg-mecho-purple-soft
                      hover:text-mecho-purple
                    "
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type={isLastStep ? "submit" : "button"}
                  onClick={isLastStep ? undefined : nextStep}
                  disabled={isSubmitting}
                  className="
                    h-11
                    rounded-full
                    border-0
                    bg-mecho-gradient
                    px-6
                    font-medium
                    text-white
                    shadow-[0_10px_28px_rgba(111,44,255,0.18)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_14px_36px_rgba(111,44,255,0.26)]
                    disabled:pointer-events-none
                    disabled:opacity-60
                  "
                >
                  {isLastStep && isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      {isLastStep ? "Log in" : "Continue"}
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </AuthShell>
  );
}
