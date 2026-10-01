"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, MailCheck, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const [resendTime, setResendTime] = useState(45);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendTime <= 0) return;

    const timer = window.setInterval(() => {
      setResendTime((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendTime]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("mecho_verification_email");

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  function validateCode() {
    const value = code.trim();

    if (!value) {
      toast.error("Verification code required", {
        description: "Enter the 6-digit code we sent to your email.",
      });

      return false;
    }

    if (!/^\d{6}$/.test(value)) {
      toast.error("Invalid verification code", {
        description: "Enter the complete 6-digit code.",
      });

      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCode()) return;

    if (!email) {
      toast.error("Verification session missing", {
        description:
          "We couldn't find the email linked to this verification request. Please sign up again.",
      });

      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      await apiFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp: code.trim(),
        }),
      });

      sessionStorage.removeItem("mecho_verification_email");

      setVerified(true);
    } catch (error) {
      toast.error("We couldn’t verify your email", {
        description:
          error instanceof Error
            ? error.message
            : "Please check the code and try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (resendTime > 0 || isResending) return;

    if (!email) {
      toast.error("Verification session missing", {
        description:
          "We couldn't find the email linked to this verification request.",
      });

      return;
    }

    setIsResending(true);

    try {
      await apiFetch("/auth/resend-verification-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });

      toast.success("New code sent", {
        description: `We sent a new verification code to ${email}.`,
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

  if (verified) {
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
            Email verified
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
            You&apos;re ready to enter Mecho.
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
            Your account is verified and your creative space is ready.
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
            <Link href="/dashboard">
              Enter Mecho
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
        <div className="mb-8">
          <div
            className="
              flex size-11
              items-center justify-center
              rounded-full
              bg-mecho-purple/10
              text-mecho-purple
            "
          >
            <MailCheck className="size-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-mecho-purple
              "
            >
              One quick check
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
              Check your email.
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
              We sent a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">
                {email || "your email"}
              </span>
              . Enter it below to finish setting up your account.
            </p>

            <div className="mt-9">
              <Input
                autoFocus
                value={code}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setCode(value);
                  setError("");
                }}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="
                  h-16
                  rounded-2xl
                  border-border/80
                  bg-background
                  px-5
                  text-center
                  text-3xl
                  font-semibold
                  tracking-[0.35em]
                  shadow-[0_8px_30px_rgba(47,1,117,0.04)]

                  sm:text-4xl lg:text-4xl xl:text-4xl

                  focus-visible:border-mecho-purple/50
                  focus-visible:ring-mecho-purple/15
                "
              />

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

              <div
                className="
                  mt-5
                  flex items-center
                  justify-center
                  text-sm
                  text-muted-foreground
                "
              >
                {resendTime > 0 ? (
                  <span>
                    Didn&apos;t get it? Resend in{" "}
                    <span className="font-medium text-foreground">
                      {resendTime}s
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="
                      font-medium
                      text-mecho-purple
                      transition-opacity
                      hover:opacity-75
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>
            </div>

            <div
              className="
                mt-9
                flex items-center
                justify-between
                gap-4
              "
            >
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
                <Link href="/signup">
                  <ArrowLeft className="mr-2 size-4" />
                  Back
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={isVerifying}
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
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify email
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </AuthShell>
  );
}
