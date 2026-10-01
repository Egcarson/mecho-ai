"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";

type SignupData = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
};

type StepKey = keyof SignupData;

type SignupStep = {
  key: StepKey;
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "password";
  optional?: boolean;
  autoComplete?: string;
};

const signupSteps: SignupStep[] = [
  {
    key: "first_name",
    eyebrow: "Let’s get to know you",
    title: "What’s your first name?",
    description:
      "We’ll use it to make your Mecho experience feel more personal.",
    placeholder: "Enter your first name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    key: "middle_name",
    eyebrow: "A little more about you",
    title: "Do you have a middle name?",
    description: "This one is optional. You can skip it if you prefer.",
    placeholder: "Enter your middle name",
    type: "text",
    optional: true,
    autoComplete: "additional-name",
  },
  {
    key: "last_name",
    eyebrow: "Almost got your name",
    title: "What’s your last name?",
    description: "Great. Just one more name and we’ll move on.",
    placeholder: "Enter your last name",
    type: "text",
    autoComplete: "family-name",
  },
  {
    key: "email",
    eyebrow: "Your Mecho account",
    title: "What email should we use?",
    description:
      "You’ll use this email to sign in and receive important account updates.",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "phone",
    eyebrow: "Stay connected",
    title: "What’s your phone number?",
    description:
      "Add the number you’d like associated with your Mecho account.",
    placeholder: "09034793278",
    type: "tel",
    autoComplete: "tel",
  },
  {
    key: "password",
    eyebrow: "Secure your space",
    title: "Create a password.",
    description:
      "Choose something strong enough to protect your projects and creative work.",
    placeholder: "Create a strong password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    key: "confirm_password",
    eyebrow: "One last check",
    title: "Confirm your password.",
    description: "Enter it once more so we know everything matches.",
    placeholder: "Enter your password again",
    type: "password",
    autoComplete: "new-password",
  },
];

const initialFormData: SignupData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
};

export default function SignupPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<SignupData>(initialFormData);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const currentStep = signupSteps[step];

  const isLastStep = step === signupSteps.length - 1;

  const progress = ((step + 1) / signupSteps.length) * 100;

  const currentValue = formData[currentStep.key];

  const firstName = useMemo(
    () => formData.first_name.trim(),
    [formData.first_name],
  );

  function updateCurrentValue(value: string) {
    setError("");

    const shouldCapitalize =
      currentStep.key === "first_name" ||
      currentStep.key === "middle_name" ||
      currentStep.key === "last_name";

    const formattedValue = shouldCapitalize
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : value;

    setFormData((current) => ({
      ...current,
      [currentStep.key]: formattedValue,
    }));
  }

  function validateCurrentStep() {
    const value = currentValue.trim();

    if (!value && !currentStep.optional) {
      toast.error("Just one thing first", {
        description: "Fill in this field so we can keep going.",
      });

      return false;
    }

    if (
      currentStep.key === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      toast.error("That email doesn’t look right", {
        description: "Enter a valid email address and try again.",
      });

      return false;
    }

    if (currentStep.key === "phone" && value.replace(/\D/g, "").length < 10) {
      toast.error("That phone number looks incomplete", {
        description: "Enter a valid phone number and try again.",
      });

      return false;
    }

    if (currentStep.key === "password" && value.length < 8) {
      toast.error("Your password is too short", {
        description: "Use at least 8 characters to keep your account secure.",
      });

      return false;
    }

    if (currentStep.key === "confirm_password" && value !== formData.password) {
      toast.error("Passwords don’t match", {
        description: "Make sure both passwords are exactly the same.",
      });

      return false;
    }

    setError("");
    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    if (!isLastStep) {
      setStep((current) => current + 1);
      setShowPassword(false);
    }
  }

  function previousStep() {
    if (step === 0) return;

    setError("");
    setShowPassword(false);

    setStep((current) => current - 1);
  }

  function skipStep() {
    if (!currentStep.optional) return;

    setError("");
    setStep((current) => current + 1);
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

    // Only the final step should create the account.
    setError("");
    setIsSubmitting(true);

    const payload = {
      first_name: formData.first_name.trim(),
      middle_name: formData.middle_name.trim() || null,
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      sessionStorage.setItem("mecho_verification_email", formData.email.trim());

      toast.success("Account created", {
        description: "We’ve sent a verification code to your email.",
      });

      router.push("/verify-email");
    } catch (error) {
      toast.error("We couldn’t create your account", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your network and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const personalisedEyebrow =
    step >= 3 && firstName
      ? `${currentStep.eyebrow}, ${firstName}`
      : currentStep.eyebrow;

  return (
    <AuthShell mode="signup">
      <div className="w-full">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="
                text-xs font-medium
                text-muted-foreground
              "
            >
              Step {step + 1} of {signupSteps.length}
            </span>

            <span
              className="
                text-xs font-medium
                text-muted-foreground
              "
            >
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
              {/* Mecho prompt */}
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
                  {personalisedEyebrow}
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

              {/* One input only */}
              <div className="mt-9">
                <div className="relative">
                  <Input
                    key={currentStep.key}
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

                {/* Password assistance */}
                {currentStep.key === "password" && (
                  <div
                    className="
                      mt-4
                      flex flex-wrap
                      gap-x-5 gap-y-2
                      text-xs
                      text-muted-foreground
                    "
                  >
                    <span className="flex items-center gap-1.5">
                      <Check className="size-3.5" />
                      At least 8 characters
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Check className="size-3.5" />
                      Mix letters & numbers
                    </span>
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

              {/* Navigation */}
              <div
                className="
                  mt-9
                  flex
                  items-center
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

                <div className="flex items-center gap-3">
                  {currentStep.optional && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={skipStep}
                      className="
                        rounded-full
                        text-muted-foreground
                      "
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    type={isLastStep ? "submit" : "button"}
                    onClick={isLastStep ? undefined : nextStep}
                    disabled={isSubmitting}
                    className="h-11 rounded-full border-0 bg-mecho-gradient px-6 font-medium text-white shadow-[0_10px_28px_rgba(111,44,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(111,44,255,0.26)] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isLastStep && isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating your account...
                      </>
                    ) : (
                      <>
                        {isLastStep ? "Create account" : "Continue"}
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms only near completion */}
              {isLastStep && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    mt-7
                    text-center
                    text-xs
                    leading-6
                    text-muted-foreground
                  "
                >
                  By creating an account, you agree to Mecho&apos;s{" "}
                  <Link
                    href="/terms"
                    className="
                      font-medium
                      text-foreground
                      hover:text-mecho-purple
                    "
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="
                      font-medium
                      text-foreground
                      hover:text-mecho-purple
                    "
                  >
                    Privacy Policy
                  </Link>
                  .
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </AuthShell>
  );
}
