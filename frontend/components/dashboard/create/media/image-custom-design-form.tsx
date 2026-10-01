"use client";

import { ChevronDown, ImagePlus, Loader2 } from "lucide-react";

import { useState } from "react";

import {
  type CustomDesignPayload,
  type ImageDesignStyle,
  type ImageFormat,
} from "@/lib/media/image";

import { ImageAssetPicker } from "./image-asset-picker";

type Props = {
  value: CustomDesignPayload;

  onChange: (value: CustomDesignPayload) => void;

  onSubmit: () => void;

  loading: boolean;
};

const DESIGN_STYLES: Array<{
  label: string;
  value: ImageDesignStyle;
}> = [
  {
    label: "Automatic",
    value: "auto",
  },
  {
    label: "Minimal",
    value: "minimal",
  },
  {
    label: "Premium",
    value: "premium",
  },
  {
    label: "Luxury",
    value: "luxury",
  },
  {
    label: "Bold",
    value: "bold",
  },
  {
    label: "Corporate",
    value: "corporate",
  },
  {
    label: "Playful",
    value: "playful",
  },
  {
    label: "Modern",
    value: "modern",
  },
];

const FORMATS: Array<{
  label: string;
  value: ImageFormat;
  description: string;
}> = [
  {
    label: "Auto",
    value: "auto",
    description: "Mecho decides",
  },
  {
    label: "Square",
    value: "square",
    description: "1:1",
  },
  {
    label: "Portrait",
    value: "portrait",
    description: "Vertical feed",
  },
  {
    label: "Story",
    value: "story",
    description: "Full-screen",
  },
  {
    label: "Landscape",
    value: "landscape",
    description: "Wide",
  },
];

export function ImageCustomDesignForm({
  value,
  onChange,
  onSubmit,
  loading,
}: Props) {
  const [contactsOpen, setContactsOpen] = useState(false);

  function update<K extends keyof CustomDesignPayload>(
    key: K,
    next: CustomDesignPayload[K],
  ) {
    onChange({
      ...value,
      [key]: next,
    });
  }

  function text(key: keyof CustomDesignPayload) {
    const current = value[key];

    return typeof current === "string" ? current : "";
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/70
        bg-background
      "
    >
      <div
        className="
          border-b
          border-border/60
          px-5
          py-5

          sm:px-6
        "
      >
        <h3
          className="
            text-base
            font-semibold
            tracking-[-0.02em]
          "
        >
          Custom Design
        </h3>

        <p
          className="
            mt-1
            max-w-2xl
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          Add only the details you care about. Mecho handles everything else.
        </p>
      </div>

      <div className="divide-y divide-border/60">
        <Section
          label="Content"
          title="What should appear?"
          description="Override specific copy only when needed."
        >
          <div
            className="
              grid
              gap-4

              md:grid-cols-2
            "
          >
            <Field
              label="Headline"
              value={text("headline")}
              placeholder="Main message"
              onChange={(next) => update("headline", next)}
            />

            <Field
              label="Subheadline"
              value={text("subheadline")}
              placeholder="Supporting message"
              onChange={(next) => update("subheadline", next)}
            />

            <Field
              label="Call to action"
              value={text("call_to_action")}
              placeholder="Shop now"
              onChange={(next) => update("call_to_action", next)}
            />

            <Field
              label="Price"
              value={text("price_text")}
              placeholder="₦25,000"
              onChange={(next) => update("price_text", next)}
            />

            <Field
              label="Promotion"
              value={text("promo_text")}
              placeholder="20% off this week"
              onChange={(next) => update("promo_text", next)}
            />
          </div>
        </Section>

        <Section
          label="Brand"
          title="Keep it recognizably yours"
          description="Optional brand details for the design."
        >
          <div
            className="
              grid
              gap-4

              md:grid-cols-2
            "
          >
            <Field
              label="Brand name"
              value={text("brand_name")}
              placeholder="Your brand"
              onChange={(next) => update("brand_name", next)}
            />

            <Field
              label="Tagline"
              value={text("tagline")}
              placeholder="Brand tagline"
              onChange={(next) => update("tagline", next)}
            />
          </div>

          <BrandColors
            values={value.brand_colors ?? []}
            onChange={(colors) => update("brand_colors", colors)}
          />
        </Section>

        <Section
          label="Direction"
          title="Shape the visual"
          description="Leave these on Auto if you want Mecho to decide."
        >
          <p className="text-xs font-semibold">Design style</p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {DESIGN_STYLES.map((style) => {
              const active = value.design_style === style.value;

              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => update("design_style", style.value)}
                  className={`
                      rounded-full
                      border
                      px-3.5
                      py-2
                      text-xs
                      font-medium
                      transition-all

                      ${
                        active
                          ? `
                            border-mecho-purple
                            bg-mecho-purple-soft
                            text-mecho-purple
                          `
                          : `
                            border-border/70
                            text-muted-foreground
                            hover:text-foreground
                          `
                      }
                    `}
                >
                  {style.label}
                </button>
              );
            })}
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
            "
          >
            Format
          </p>

          <div
            className="
              mt-3
              grid
              gap-2

              sm:grid-cols-2
              lg:grid-cols-5
            "
          >
            {FORMATS.map((format) => {
              const active = value.format === format.value;

              return (
                <button
                  key={format.value}
                  type="button"
                  onClick={() => update("format", format.value)}
                  className={`
                      rounded-2xl
                      border
                      px-3
                      py-3
                      text-left
                      transition-all

                      ${
                        active
                          ? `
                            border-mecho-purple
                            bg-mecho-purple-soft/60
                          `
                          : `
                            border-border/70
                          `
                      }
                    `}
                >
                  <span
                    className="
                        block
                        text-xs
                        font-semibold
                      "
                  >
                    {format.label}
                  </span>

                  <span
                    className="
                        mt-1
                        block
                        text-[10px]
                        text-muted-foreground
                      "
                  >
                    {format.description}
                  </span>
                </button>
              );
            })}
          </div>

          <label
            className="
              mt-6
              block
            "
          >
            <span className="text-xs font-semibold">Design notes</span>

            <textarea
              rows={4}
              value={value.design_notes ?? ""}
              onChange={(event) => update("design_notes", event.target.value)}
              placeholder="Anything else Mecho should consider?"
              className="
                mt-2
                w-full
                resize-none
                rounded-2xl
                border
                border-border/70
                bg-background
                px-4
                py-3
                text-sm
                outline-none

                focus:border-mecho-purple/40
              "
            />
          </label>

          <label
            className="
              mt-5
              flex
              cursor-pointer
              items-center
              justify-between
              gap-4
              rounded-2xl
              border
              border-border/60
              px-4
              py-3
            "
          >
            <div>
              <p className="text-sm font-medium">Include hashtags</p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-muted-foreground
                "
              >
                Let hashtags appear when they suit the visual.
              </p>
            </div>

            <input
              type="checkbox"
              checked={value.include_hashtags ?? false}
              onChange={(event) =>
                update("include_hashtags", event.target.checked)
              }
              className="size-4 accent-mecho-purple"
            />
          </label>
        </Section>

        <Section
          label="Images"
          title="Bring your own visuals"
          description="Choose something you've uploaded before or add a new image."
        >
          <div className="space-y-8">
            <ImageAssetPicker
              role="logo"
              title="Logo"
              description="Choose one logo."
              selected={value.logo_asset_uid ? [value.logo_asset_uid] : []}
              onChange={(ids) => update("logo_asset_uid", ids[0] ?? null)}
            />

            <ImageAssetPicker
              role="primary"
              title="Primary images"
              description="Products, people or services that should feature in the design."
              multiple
              selected={value.primary_asset_uids ?? []}
              onChange={(ids) => update("primary_asset_uids", ids)}
            />

            <ImageAssetPicker
              role="reference"
              title="Reference images"
              description="Visual inspiration for Mecho to follow."
              multiple
              selected={value.reference_asset_uids ?? []}
              onChange={(ids) => update("reference_asset_uids", ids)}
            />
          </div>
        </Section>

        <div
          className="
            px-5
            py-6

            sm:px-6
          "
        >
          <button
            type="button"
            onClick={() => setContactsOpen((current) => !current)}
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              text-left
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-mecho-purple
                "
              >
                Contact
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                "
              >
                Add ways people can reach you
              </p>
            </div>

            <ChevronDown
              className={`
                size-4
                transition-transform

                ${contactsOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {contactsOpen && (
            <div
              className="
                mt-5
                grid
                gap-4

                md:grid-cols-2
              "
            >
              <Field
                label="WhatsApp"
                value={text("whatsapp")}
                placeholder="+234..."
                onChange={(next) => update("whatsapp", next)}
              />

              <Field
                label="Phone"
                value={text("phone")}
                placeholder="+234..."
                onChange={(next) => update("phone", next)}
              />

              <Field
                label="Instagram"
                value={text("instagram")}
                placeholder="@brand"
                onChange={(next) => update("instagram", next)}
              />

              <Field
                label="TikTok"
                value={text("tiktok")}
                placeholder="@brand"
                onChange={(next) => update("tiktok", next)}
              />

              <Field
                label="X"
                value={text("twitter")}
                placeholder="@brand"
                onChange={(next) => update("twitter", next)}
              />

              <Field
                label="Facebook"
                value={text("facebook")}
                placeholder="Business page"
                onChange={(next) => update("facebook", next)}
              />

              <Field
                label="Website"
                value={text("website")}
                placeholder="www.example.com"
                onChange={(next) => update("website", next)}
              />

              <Field
                label="Address"
                value={text("address")}
                placeholder="Business address"
                onChange={(next) => update("address", next)}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="
          flex
          justify-end
          border-t
          border-border/60
          bg-muted/15
          px-5
          py-4

          sm:px-6
        "
      >
        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-full
            bg-mecho-gradient
            px-5
            text-sm
            font-semibold
            text-white
            shadow-[0_10px_26px_rgba(111,44,255,0.18)]

            disabled:pointer-events-none
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ImagePlus className="size-4" />
              Generate custom design
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        px-5
        py-6

        sm:px-6
      "
    >
      <p
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.14em]
          text-mecho-purple
        "
      >
        {label}
      </p>

      <h4
        className="
          mt-1
          text-sm
          font-semibold
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1
          max-w-xl
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        {description}
      </p>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          h-11
          w-full
          rounded-xl
          border
          border-border/70
          bg-background
          px-3.5
          text-sm
          outline-none

          placeholder:text-muted-foreground/60

          focus:border-mecho-purple/40
        "
      />
    </label>
  );
}

function BrandColors({
  values,
  onChange,
}: {
  values: string[];

  onChange: (values: string[]) => void;
}) {
  const [color, setColor] = useState("#35104f");

  function add() {
    if (values.includes(color)) {
      return;
    }

    onChange([...values, color]);
  }

  return (
    <div className="mt-5">
      <p className="text-xs font-semibold">Brand colors</p>

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        {values.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              onChange(values.filter((existing) => existing !== item))
            }
            className="
                inline-flex
                h-9
                items-center
                gap-2
                rounded-full
                border
                border-border/70
                px-3
                text-xs
              "
          >
            <span
              className="
                  size-4
                  rounded-full
                  border
                  border-black/10
                "
              style={{
                backgroundColor: item,
              }}
            />

            {item}

            <span>×</span>
          </button>
        ))}

        <input
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          className="
            size-9
            cursor-pointer
            rounded-full
            border-0
            bg-transparent
          "
        />

        <button
          type="button"
          onClick={add}
          className="
            rounded-full
            border
            border-border/70
            px-3
            py-2
            text-xs
            font-medium
          "
        >
          Add color
        </button>
      </div>
    </div>
  );
}
