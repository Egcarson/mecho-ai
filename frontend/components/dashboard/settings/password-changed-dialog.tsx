"use client";

import { useState } from "react";

import { Check, Loader2, LogOut } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { logoutAll } from "@/lib/settings";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PasswordChangedDialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;
};

export function PasswordChangedDialog({
  open,
  onOpenChange,
}: PasswordChangedDialogProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogoutAll() {
    setLoading(true);

    try {
      await logoutAll();

      toast.success("You've been logged out of all devices.");

      router.replace("/login");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't log out all devices.",
      );

      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-md
          rounded-[1.5rem]
        "
      >
        <DialogHeader>
          <div
            className="
              mb-3
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-emerald-500/10
              text-emerald-600

              dark:text-emerald-400
            "
          >
            <Check className="size-5" />
          </div>

          <DialogTitle>Password changed</DialogTitle>

          <DialogDescription>
            Your new password is active. You can stay signed in here or log out
            every device for extra security.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            mt-4
            grid
            gap-3
          "
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="
              h-11
              rounded-full
              border
              border-border/60
              text-sm
              font-medium
              transition-colors

              hover:bg-muted/50
            "
          >
            Stay logged in
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              void handleLogoutAll();
            }}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-mecho-gradient
              text-sm
              font-semibold
              text-white

              disabled:opacity-60
            "
          >
            {loading ? (
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />
            ) : (
              <LogOut className="size-4" />
            )}
            Log out all devices
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
