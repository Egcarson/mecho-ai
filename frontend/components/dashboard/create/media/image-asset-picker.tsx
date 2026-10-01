"use client";

import Image from "next/image";

import { Check, ImagePlus, Loader2, Upload, X } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";

import {
  getImageAssets,
  uploadImageAsset,
  type AssetRole,
  type ImageAsset,
} from "@/lib/media/assets";

type ImageAssetPickerProps = {
  role: AssetRole;
  title: string;
  description: string;

  multiple?: boolean;

  selected: string[];

  onChange: (selected: string[]) => void;
};

export function ImageAssetPicker({
  role,
  title,
  description,
  multiple = false,
  selected,
  onChange,
}: ImageAssetPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [assets, setAssets] = useState<ImageAsset[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const response = await getImageAssets();

        if (!cancelled) {
          setAssets(response);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error("Couldn't load saved images.", {
            description: error instanceof Error ? error.message : undefined,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const matchingAssets = useMemo(
    () => assets.filter((asset) => asset.role === role),
    [assets, role],
  );

  function toggle(uid: string) {
    const exists = selected.includes(uid);

    if (!multiple) {
      onChange(exists ? [] : [uid]);

      return;
    }

    if (exists) {
      onChange(selected.filter((item) => item !== uid));

      return;
    }

    onChange([...selected, uid]);
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      const uploaded = await uploadImageAsset({
        file,
        role,
      });

      setAssets((current) => [uploaded, ...current]);

      if (multiple) {
        onChange([...selected, uploaded.uid]);
      } else {
        onChange([uploaded.uid]);
      }

      toast.success("Image uploaded.");
    } catch (error) {
      toast.error("Couldn't upload image.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <div>
        <p
          className="
            text-sm
            font-semibold
            tracking-[-0.015em]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="
          image/jpeg,
          image/png,
          image/webp
        "
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleUpload(file);
          }
        }}
      />

      <div
        className="
          mt-4
          flex
          gap-3
          overflow-x-auto
          pb-2
        "
      >
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="
            flex
            size-[108px]
            shrink-0
            flex-col
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-dashed
            border-border/80
            bg-muted/20
            text-muted-foreground
            transition-all

            hover:border-mecho-purple/30
            hover:bg-mecho-purple-soft/40
            hover:text-mecho-purple

            disabled:pointer-events-none
            disabled:opacity-60
          "
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
          )}

          <span
            className="
              text-[11px]
              font-medium
            "
          >
            {uploading ? "Uploading" : "Upload new"}
          </span>
        </button>

        {loading &&
          Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                  size-[108px]
                  shrink-0
                  animate-pulse
                  rounded-2xl
                  bg-muted
                "
            />
          ))}

        {!loading &&
          matchingAssets.map((asset) => {
            const active = selected.includes(asset.uid);

            return (
              <button
                key={asset.uid}
                type="button"
                onClick={() => toggle(asset.uid)}
                className={`
                    group
                    relative
                    size-[108px]
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border
                    transition-all

                    ${
                      active
                        ? `
                          border-mecho-purple
                          ring-2
                          ring-mecho-purple/15
                        `
                        : `
                          border-border/70
                          hover:border-mecho-purple/30
                        `
                    }
                  `}
              >
                <Image
                  src={asset.url}
                  alt={asset.file_name}
                  fill
                  className="object-cover"
                  sizes="108px"
                />

                {active && (
                  <span
                    className="
                        absolute
                        right-2
                        top-2
                        flex
                        size-6
                        items-center
                        justify-center
                        rounded-full
                        bg-mecho-purple
                        text-white
                        shadow-lg
                      "
                  >
                    <Check className="size-3.5" />
                  </span>
                )}
              </button>
            );
          })}

        {!loading && matchingAssets.length === 0 && (
          <div
            className="
                flex
                min-h-[108px]
                min-w-[190px]
                items-center
                justify-center
                rounded-2xl
                border
                border-border/60
                bg-muted/15
                px-5
                text-center
              "
          >
            <div>
              <ImagePlus
                className="
                    mx-auto
                    size-5
                    text-muted-foreground
                  "
              />

              <p
                className="
                    mt-2
                    text-xs
                    text-muted-foreground
                  "
              >
                No saved images here yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div
          className="
            mt-2
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[11px]
              text-muted-foreground
            "
          >
            {selected.length} selected
          </span>

          <button
            type="button"
            onClick={() => onChange([])}
            className="
              inline-flex
              items-center
              gap-1
              text-[11px]
              font-medium
              text-muted-foreground
              transition-colors

              hover:text-foreground
            "
          >
            <X className="size-3" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
