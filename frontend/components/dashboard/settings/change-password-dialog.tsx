"use client";

import { useState } from "react";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { toast } from "sonner";

import { changePassword } from "@/lib/settings";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ChangePasswordDialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => void;
};

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
  }

  async function handleSubmit() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Complete all password fields.");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");

      return;
    }

    if (newPassword === currentPassword) {
      toast.error("Your new password must be different.");

      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);

      reset();

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't change password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }

        onOpenChange(value);
      }}
    >
      <DialogContent
        className="
          max-w-md
          rounded-[1.5rem]
        "
      >
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>

          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            mt-3
            space-y-5
          "
        >
          <PasswordField
            label="Current password"
            value={currentPassword}
            visible={showCurrent}
            onVisibleChange={setShowCurrent}
            onChange={setCurrentPassword}
          />

          <PasswordField
            label="New password"
            value={newPassword}
            visible={showNew}
            onVisibleChange={setShowNew}
            onChange={setNewPassword}
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            visible={showNew}
            onVisibleChange={setShowNew}
            onChange={setConfirmPassword}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              void handleSubmit();
            }}
            className="
              inline-flex
              h-11
              w-full
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
            {loading && (
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />
            )}
            Change password
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  visible: boolean;

  onChange: (value: string) => void;

  onVisibleChange: (visible: boolean) => void;
};

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onVisibleChange,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        className="
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-11
            w-full
            rounded-xl
            border
            border-border/60
            bg-background
            px-4
            pr-11
            text-sm
            outline-none

            focus:border-mecho-purple/30
            focus:ring-4
            focus:ring-mecho-purple/5
          "
        />

        <button
          type="button"
          onClick={() => onVisibleChange(!visible)}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-muted-foreground
          "
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
