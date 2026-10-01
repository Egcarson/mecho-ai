"use client";

import { useRef, useState } from "react";

import { Camera, Loader2, Pencil, Trash2, X } from "lucide-react";

import { toast } from "sonner";

import {
  removeAvatar,
  updateProfile,
  uploadAvatar,
  type SettingsUser,
} from "@/lib/settings";

type ProfileSettingsProps = {
  user: SettingsUser;

  onUserChange: (user: SettingsUser) => void;
};

export function ProfileSettings({ user, onUserChange }: ProfileSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState(user.first_name);

  const [middleName, setMiddleName] = useState(user.middle_name ?? "");

  const [lastName, setLastName] = useState(user.last_name);

  const [phone, setPhone] = useState(user.phone);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [removing, setRemoving] = useState(false);

  function resetFields() {
    setFirstName(user.first_name);

    setMiddleName(user.middle_name ?? "");

    setLastName(user.last_name);

    setPhone(user.phone);
  }

  function handleEdit() {
    resetFields();
    setEditing(true);
  }

  function handleCancel() {
    resetFields();
    setEditing(false);
  }

  async function handleSave() {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast.error("First name, last name and phone are required.");

      return;
    }

    setSaving(true);

    try {
      const updated = await updateProfile({
        first_name: firstName.trim(),

        middle_name: middleName.trim(),

        last_name: lastName.trim(),

        phone: phone.trim(),
      });

      onUserChange(updated);

      setEditing(false);

      toast.success("Profile updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Use a JPEG, PNG or WebP image.");

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Profile photo must be 5 MB or smaller.");

      return;
    }

    setUploading(true);

    try {
      const updated = await uploadAvatar(file);

      onUserChange(updated);

      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't upload profile photo.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    setRemoving(true);

    try {
      const updated = await removeAvatar();

      if (updated) {
        onUserChange(updated);
      } else {
        onUserChange({
          ...user,
          profile_picture_url: null,
        });
      }

      toast.success("Profile photo removed.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't remove profile photo.",
      );
    } finally {
      setRemoving(false);
    }
  }

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  return (
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
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-xl
              font-semibold
              tracking-[-0.03em]
            "
          >
            Profile
          </h2>

          <p
            className="
              mt-1
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            Manage the personal details associated with your Mecho account.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
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
            "
          >
            <Pencil className="size-4" />
            Edit profile
          </button>
        )}
      </div>

      <div
        className="
          mt-7
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-center
        "
      >
        <div
          className="
            flex
            size-20
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-mecho-purple-soft
            text-lg
            font-semibold
            text-mecho-purple
          "
        >
          {user.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt=""
              className="
                size-full
                object-cover
              "
            />
          ) : (
            initials
          )}
        </div>

        <div>
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="
                inline-flex
                h-10
                items-center
                gap-2
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
              {uploading ? (
                <Loader2
                  className="
                    size-4
                    animate-spin
                  "
                />
              ) : (
                <Camera className="size-4" />
              )}
              Change photo
            </button>

            {user.profile_picture_url && (
              <button
                type="button"
                disabled={removing}
                onClick={() => {
                  void handleRemoveAvatar();
                }}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors

                  hover:bg-red-500/5
                  hover:text-red-600

                  dark:hover:text-red-400

                  disabled:opacity-50
                "
              >
                {removing ? (
                  <Loader2
                    className="
                      size-4
                      animate-spin
                    "
                  />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Remove
              </button>
            )}
          </div>

          <p
            className="
              mt-2
              text-xs
              text-muted-foreground
            "
          >
            JPEG, PNG or WebP. Maximum 5 MB.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void handleFile(file);
            }

            event.target.value = "";
          }}
        />
      </div>

      <div
        className="
          mt-8
          grid
          gap-5

          md:grid-cols-2
        "
      >
        <Field
          label="First name"
          value={firstName}
          disabled={!editing}
          onChange={setFirstName}
        />

        <Field
          label="Middle name"
          value={middleName}
          disabled={!editing}
          onChange={setMiddleName}
        />

        <Field
          label="Last name"
          value={lastName}
          disabled={!editing}
          onChange={setLastName}
        />

        <Field
          label="Phone"
          value={phone}
          type="tel"
          disabled={!editing}
          onChange={setPhone}
        />

        <div
          className="
            md:col-span-2
          "
        >
          <label
            className="
              text-sm
              font-medium
            "
          >
            Email
          </label>

          <input
            value={user.email}
            disabled
            className="
              mt-2
              h-11
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-border/60
              bg-muted/35
              px-4
              text-sm
              text-muted-foreground
              outline-none
            "
          />

          <p
            className="
              mt-2
              text-xs
              text-muted-foreground
            "
          >
            Your email address cannot be changed.
          </p>
        </div>
      </div>

      {editing && (
        <div
          className="
            mt-7
            flex
            flex-wrap
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/60
              px-5
              text-sm
              font-medium
              transition-colors

              hover:bg-muted/50

              disabled:opacity-50
            "
          >
            <X className="size-4" />
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              void handleSave();
            }}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              bg-mecho-gradient
              px-5
              text-sm
              font-semibold
              text-white

              disabled:opacity-60
            "
          >
            {saving && (
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />
            )}
            Save changes
          </button>
        </div>
      )}
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;

  type?: string;
  disabled?: boolean;

  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  type = "text",
  disabled = false,
  onChange,
}: FieldProps) {
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

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          h-11
          w-full
          rounded-xl
          border
          border-border/60
          px-4
          text-sm
          outline-none
          transition-all

          disabled:cursor-default
          disabled:bg-muted/25
          disabled:text-foreground/75

          enabled:bg-background
          enabled:focus:border-mecho-purple/30
          enabled:focus:ring-4
          enabled:focus:ring-mecho-purple/5
        "
      />
    </div>
  );
}
