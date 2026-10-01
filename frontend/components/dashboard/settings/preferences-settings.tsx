"use client";

import { useEffect, useState } from "react";

import { Loader2, Pencil, X } from "lucide-react";

import { toast } from "sonner";

import {
  getVoices,
  updatePreferences,
  type UserPreferences,
  type VoiceDefinition,
} from "@/lib/settings";

type PreferencesSettingsProps = {
  preferences: UserPreferences;

  onChange: (preferences: UserPreferences) => void;
};

const LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: "english",
  },
  {
    label: "Pidgin",
    value: "pidgin",
  },
  {
    label: "Yoruba",
    value: "yoruba",
  },
  {
    label: "Igbo",
    value: "igbo",
  },
  {
    label: "Hausa",
    value: "hausa",
  },
];

const TONE_OPTIONS = [
  {
    label: "Friendly",
    value: "friendly",
  },
  {
    label: "Professional",
    value: "professional",
  },
  {
    label: "Conversational",
    value: "conversational",
  },
  {
    label: "Persuasive",
    value: "persuasive",
  },
  {
    label: "Confident",
    value: "confident",
  },
];

const WORKFLOW_OPTIONS = [
  {
    label: "Social",
    value: "social",
  },
  {
    label: "Campaign",
    value: "campaign",
  },
  {
    label: "Speech",
    value: "speech",
  },
];

export function PreferencesSettings({
  preferences,
  onChange,
}: PreferencesSettingsProps) {
  const [editing, setEditing] = useState(false);

  const [language, setLanguage] = useState(preferences.default_language ?? "");

  const [tone, setTone] = useState(preferences.default_tone ?? "");

  const [voice, setVoice] = useState(preferences.default_voice ?? "");

  const [workflow, setWorkflow] = useState(preferences.default_workflow ?? "");

  const [voices, setVoices] = useState<VoiceDefinition[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadVoices() {
      const result = await getVoices();

      if (!cancelled) {
        setVoices(result);
      }
    }

    void loadVoices();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetFields() {
    setLanguage(preferences.default_language ?? "");

    setTone(preferences.default_tone ?? "");

    setVoice(preferences.default_voice ?? "");

    setWorkflow(preferences.default_workflow ?? "");
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
    setSaving(true);

    try {
      const updated = await updatePreferences({
        default_language: language,

        default_tone: tone,

        default_voice: voice,

        default_workflow: workflow,

        preferences: preferences.preferences ?? {},
      });

      onChange(updated);

      setEditing(false);

      toast.success("Preferences updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

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
            Preferences
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
            Choose the defaults Mecho should start with when you create
            something new.
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
            Edit preferences
          </button>
        )}
      </div>

      <div
        className="
          mt-7
          grid
          gap-5

          md:grid-cols-2
        "
      >
        <SelectField
          label="Default language"
          value={language}
          options={LANGUAGE_OPTIONS}
          disabled={!editing}
          onChange={setLanguage}
        />

        <SelectField
          label="Default tone"
          value={tone}
          options={TONE_OPTIONS}
          disabled={!editing}
          onChange={setTone}
        />

        <SelectField
          label="Default workflow"
          value={workflow}
          options={WORKFLOW_OPTIONS}
          disabled={!editing}
          onChange={setWorkflow}
        />

        <SelectField
          label="Default voice"
          value={voice}
          options={voices.map((item) => ({
            label: item.display_name || formatLabel(item.name),

            value: item.name,
          }))}
          disabled={!editing}
          onChange={setVoice}
          placeholder={voices.length ? "Choose a voice" : "No voices available"}
        />
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
            Save preferences
          </button>
        </div>
      )}
    </section>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string;

  options: SelectOption[];

  placeholder?: string;

  disabled?: boolean;

  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  placeholder = "Choose an option",
  disabled = false,
  onChange,
}: SelectFieldProps) {
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

      <select
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
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
