"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type TagInputProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
};

export function TagInput({
  values,
  onChange,
  placeholder = "Type and add...",
  addLabel = "Add",
}: TagInputProps) {
  const [value, setValue] = useState("");

  function addValue() {
    const cleanValue = value.trim();

    if (!cleanValue) {
      return;
    }

    const alreadyExists = values.some(
      (item) => item.toLowerCase() === cleanValue.toLowerCase(),
    );

    if (alreadyExists) {
      setValue("");
      return;
    }

    onChange([...values, cleanValue]);

    setValue("");
  }

  function removeValue(valueToRemove: string) {
    onChange(values.filter((item) => item !== valueToRemove));
  }

  return (
    <div>
      <div
        className="
          flex
          gap-2
        "
      >
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              addValue();
            }
          }}
          placeholder={placeholder}
          className="
            h-11
            flex-1
            rounded-xl
            border
            border-border/70
            bg-background
            px-4
            text-sm
            outline-none
            transition-colors

            focus:border-mecho-purple/30
          "
        />

        <button
          type="button"
          onClick={addValue}
          disabled={!value.trim()}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-mecho-gradient
            px-4
            text-sm
            font-semibold
            text-white

            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          <Plus className="size-4" />

          {addLabel}
        </button>
      </div>

      {values.length > 0 && (
        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {values.map((item) => (
            <span
              key={item}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-mecho-purple/15
                bg-mecho-purple-soft/50
                px-3
                py-1.5
                text-sm
                text-foreground/80
              "
            >
              {item}

              <button
                type="button"
                onClick={() => removeValue(item)}
                aria-label={`Remove ${item}`}
                className="
                  inline-flex
                  size-5
                  items-center
                  justify-center
                  rounded-full
                  text-muted-foreground
                  transition-colors

                  hover:bg-mecho-purple/10
                  hover:text-mecho-purple
                "
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
