"use client";

import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  firstName?: string | null;
  lastName?: string | null;

  profilePictureUrl?: string | null;

  legacyAvatar?: string | null;

  className?: string;
  fallbackClassName?: string;

  alt?: string;
};

export function UserAvatar({
  firstName,
  lastName,
  profilePictureUrl,
  legacyAvatar,
  className = "size-9",
  fallbackClassName = "",
  alt,
}: UserAvatarProps) {
  const firstInitial = firstName?.trim()?.[0] ?? "";

  const lastInitial = lastName?.trim()?.[0] ?? "";

  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  const image = profilePictureUrl || legacyAvatar || undefined;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <Avatar
      className={`
        shrink-0
        ${className}
      `}
    >
      <AvatarImage
        src={image}
        alt={alt || fullName || "Profile picture"}
        className="object-cover"
      />

      <AvatarFallback
        className={`
          bg-mecho-gradient
          font-semibold
          text-white
          ${fallbackClassName}
        `}
      >
        {initials || <UserRound className="size-[42%]" />}
      </AvatarFallback>
    </Avatar>
  );
}
