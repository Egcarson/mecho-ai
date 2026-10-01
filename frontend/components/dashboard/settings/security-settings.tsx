"use client";

import { useState } from "react";

import { KeyRound, LogOut, Shield, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { logoutAll } from "@/lib/settings";

import { ChangePasswordDialog } from "./change-password-dialog";

import { PasswordChangedDialog } from "./password-changed-dialog";

import { DeleteAccountDialog } from "./delete-account-dialog";

export function SecuritySettings() {
  const router = useRouter();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [passwordChangedOpen, setPasswordChangedOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogoutAll() {
    const confirmed = window.confirm(
      "Log out of all devices, including this one?",
    );

    if (!confirmed) {
      return;
    }

    setLoggingOut(true);

    try {
      await logoutAll();

      toast.success("Logged out of all devices.");

      router.replace("/login");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't log out all devices.",
      );

      setLoggingOut(false);
    }
  }

  return (
    <>
      <section
        className="
          rounded-[1.75rem]
          border
          border-border/60
          bg-background/75
          p-5

          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-mecho-purple-soft/60
              text-mecho-purple
            "
          >
            <Shield className="size-4" />
          </div>

          <div>
            <h2
              className="
                text-xl
                font-semibold
                tracking-[-0.03em]
              "
            >
              Security
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Manage your password and active sessions.
            </p>
          </div>
        </div>

        <div
          className="
            mt-7
            divide-y
            divide-border/60
          "
        >
          <SecurityRow
            icon={KeyRound}
            title="Password"
            description="Change the password you use to sign in to Mecho."
            action="Change password"
            onClick={() => setChangePasswordOpen(true)}
          />

          <SecurityRow
            icon={LogOut}
            title="Active sessions"
            description="Sign out of every device currently connected to your account."
            action={loggingOut ? "Logging out..." : "Log out all"}
            onClick={() => {
              void handleLogoutAll();
            }}
            disabled={loggingOut}
          />
        </div>
      </section>

      <section
        className="
          rounded-[1.75rem]
          border
          border-red-500/15
          bg-red-500/[0.025]
          p-5

          sm:p-7
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
                tracking-[-0.025em]
              "
            >
              Delete account
            </h2>

            <p
              className="
                mt-1
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Permanently remove your Mecho account and associated account data.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-red-500/20
              px-4
              text-sm
              font-medium
              text-red-600
              transition-colors

              hover:bg-red-500/8

              dark:text-red-400
            "
          >
            <Trash2 className="size-4" />
            Delete account
          </button>
        </div>
      </section>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onSuccess={() => setPasswordChangedOpen(true)}
      />

      <PasswordChangedDialog
        open={passwordChangedOpen}
        onOpenChange={setPasswordChangedOpen}
      />

      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

type SecurityRowProps = {
  icon: React.ElementType;

  title: string;
  description: string;
  action: string;

  disabled?: boolean;

  onClick: () => void;
};

function SecurityRow({
  icon: Icon,
  title,
  description,
  action,
  disabled = false,
  onClick,
}: SecurityRowProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        py-5

        first:pt-0
        last:pb-0

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <Icon
          className="
            mt-0.5
            size-4
            shrink-0
            text-muted-foreground
          "
        />

        <div>
          <p
            className="
              text-sm
              font-medium
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              max-w-lg
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="
          h-9
          shrink-0
          self-start
          rounded-full
          border
          border-border/60
          px-4
          text-sm
          font-medium
          transition-colors

          hover:border-mecho-purple/20
          hover:bg-mecho-purple-soft/40
          hover:text-mecho-purple

          disabled:opacity-50
        "
      >
        {action}
      </button>
    </div>
  );
}
