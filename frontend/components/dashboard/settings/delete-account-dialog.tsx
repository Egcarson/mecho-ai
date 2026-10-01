"use client";

import { useState } from "react";

import { Loader2, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteAccount } from "@/lib/settings";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteAccountDialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!password) {
      toast.error("Enter your password to continue.");

      return;
    }

    setLoading(true);

    try {
      await deleteAccount(password);

      toast.success("Your account has been deleted.");

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't delete your account.",
      );

      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setPassword("");
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
          <div
            className="
              mb-3
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              text-red-600

              dark:text-red-400
            "
          >
            <Trash2 className="size-5" />
          </div>

          <DialogTitle>Delete account?</DialogTitle>

          <DialogDescription>
            This permanently deletes your Mecho account. Enter your password to
            confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label
            className="
              text-sm
              font-medium
            "
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="
              mt-2
              h-11
              w-full
              rounded-xl
              border
              border-border/60
              bg-background
              px-4
              text-sm
              outline-none

              focus:border-red-500/30
              focus:ring-4
              focus:ring-red-500/5
            "
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              void handleDelete();
            }}
            className="
              mt-5
              inline-flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-red-600
              text-sm
              font-semibold
              text-white
              transition-colors

              hover:bg-red-700

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
            Permanently delete account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
