"use client";

import { useEffect, useState } from "react";
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

import { apiFetch } from "@/lib/api";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResetData = {
  email: string;
  otp: string;
  password: string;
  confirm_password: string;
};

type VerifyResetOtpResponse = {
  reset_token: string;
};

const steps = [
  {
    key: "email" as const,
    eyebrow: "Password recovery",
    title: "What email is your account using?",
    description:
      "We’ll send a verification code so you can securely reset your password.",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "otp" as const,
    eyebrow: "Check your inbox",
    title: "Enter your verification code.",
    description: "Use the code we sent to your email address.",
    placeholder: "Enter verification code",
    type: "text",
    autoComplete: "one-time-code",
  },
  {
    key: "password" as const,
    eyebrow: "Choose something new",
    title: "Create a new password.",
    description:
      "Use a strong password you haven’t used for this account before.",
    placeholder: "Enter a new password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    key: "confirm_password" as const,
    eyebrow: "One last check",
    title: "Confirm your new password.",
    description: "Enter it again so we know everything matches.",
    placeholder: "Enter your new password again",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function ForgotPasswordPage() {
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [resendTime, setResendTime] = useState(45);

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<ResetData>({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStep = steps[step];
  const currentValue = formData[currentStep.key];
  const isLastStep = step === steps.length - 1;

  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (resendTime <= 0) return;

    const timer = window.setInterval(() => {
      setResendTime((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendTime]);

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

    if (currentStep.key === "otp" && value.length < 4) {
      toast.error("Verification code incomplete", {
        description: "Enter the complete code we sent to your email.",
      });
      return false;
    }

    if (currentStep.key === "password" && value.length < 8) {
      toast.error("Password is too short", {
        description: "Use at least 8 characters to create a stronger password.",
      });
      return false;
    }

    if (currentStep.key === "confirm_password" && value !== formData.password) {
      toast.error("Passwords don’t match", {
        description: "Make sure both password entries are exactly the same.",
      });
      return false;
    }

    setError("");
    return true;
  }

  async function nextStep() {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    try {
      // STEP 1: EMAIL
      if (currentStep.key === "email") {
        await apiFetch("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({
            email: formData.email.trim(),
          }),
        });

        toast.success("Check your email", {
          description:
            "If an account exists for that email, a reset code has been sent.",
        });

        setResendTime(45);
        setStep((current) => current + 1);
        return;
      }

      // STEP 2: OTP
      if (currentStep.key === "otp") {
        const response = await apiFetch<VerifyResetOtpResponse>(
          "/auth/verify-reset-otp",
          {
            method: "POST",
            body: JSON.stringify({
              email: formData.email.trim(),
              otp: formData.otp.trim(),
            }),
          },
        );

        setResetToken(response.reset_token);

        toast.success("Code verified", {
          description: "Now choose your new password.",
        });

        setStep((current) => current + 1);

        return;
      }

      // STEP 3: NEW PASSWORD
      if (currentStep.key === "password") {
        setShowPassword(false);
        setStep((current) => current + 1);
      }
    } catch (error) {
      toast.error("We couldn’t complete the reset", {
        description:
          error instanceof Error
            ? error.message
            : "Please check the email and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function previousStep() {
    if (step === 0) return;

    setError("");
    setShowPassword(false);

    setStep((current) => current - 1);
  }

  async function handleResend() {
    if (resendTime > 0 || isResending) return;

    const email = formData.email.trim();

    if (!email) {
      toast.error("Email missing", {
        description:
          "We couldn't find the email linked to this password reset.",
      });

      return;
    }

    setIsResending(true);

    try {
      await apiFetch("/auth/resend-reset-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });

      toast.success("New code sent", {
        description: `We sent another reset code to ${email}.`,
      });

      setResendTime(45);
    } catch (error) {
      toast.error("We couldn’t resend the code", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // The API request must only happen on the final screen.
    if (!isLastStep) {
      return;
    }

    if (!validateCurrentStep()) return;

    if (!resetToken) {
      toast.error("Reset session missing", {
        description:
          "Your password reset session could not be found. Please request a new code.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: formData.password,
        }),
      });

      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });

      setCompleted(true);
    } catch (error) {
      toast.error("We couldn’t reset your password", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (completed) {
    return (
      <AuthShell mode="neutral">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full"
        >
          <div
            className="
              flex size-12
              items-center justify-center
              rounded-full
              bg-mecho-purple/10
              text-mecho-purple
            "
          >
            <Check className="size-5" />
          </div>

          <p
            className="
              mt-8
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-mecho-purple
            "
          >
            You’re all set
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
            Your password has been reset.
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
            You can now log in with your new password and continue where you
            left off.
          </p>

          <Button
            asChild
            className="
              mt-9
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
            "
          >
            <Link href="/login">
              Back to login
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode="neutral">
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

        <form onSubmit={handleSubmit}>
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

              {/* Single input */}
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
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;

                      event.preventDefault();
                      event.stopPropagation();

                      if (isSubmitting) return;

                      if (isLastStep) {
                        event.currentTarget.form?.requestSubmit();
                        return;
                      }

                      void nextStep();
                    }}
                    placeholder={currentStep.placeholder}
                    autoComplete={currentStep.autoComplete}
                    inputMode={
                      currentStep.key === "otp" ? "numeric" : undefined
                    }
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

                {currentStep.key === "otp" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTime > 0 || isResending}
                      className="
                        text-sm
                        font-medium
                        text-mecho-purple
                        transition-opacity
                        hover:opacity-75
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isResending
                        ? "Sending..."
                        : resendTime > 0
                          ? `Resend code in ${resendTime}s`
                          : "Resend code"}
                    </button>
                  </div>
                )}

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
                  <Button
                    asChild
                    type="button"
                    variant="ghost"
                    className="
                      rounded-full
                      px-3
                      text-muted-foreground
                    "
                  >
                    <Link href="/login">
                      <ArrowLeft className="mr-2 size-4" />
                      Login
                    </Link>
                  </Button>
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />

                      {currentStep.key === "email"
                        ? "Sending code..."
                        : currentStep.key === "otp"
                          ? "Verifying..."
                          : isLastStep
                            ? "Resetting..."
                            : "Please wait..."}
                    </>
                  ) : (
                    <>
                      {isLastStep
                        ? "Reset password"
                        : currentStep.key === "email"
                          ? "Send code"
                          : "Continue"}

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
