"use client";

import { useState } from "react";
import { Plus, Star, X } from "lucide-react";

export type SpeechMemory = {
  memory: string;
  significance: string;
  emphasis: boolean;
};

type SpeechMemoryBuilderProps = {
  values: SpeechMemory[];

  onChange: (values: SpeechMemory[]) => void;
};

export function SpeechMemoryBuilder({
  values,
  onChange,
}: SpeechMemoryBuilderProps) {
  const [memory, setMemory] = useState("");

  const [significance, setSignificance] = useState("");

  const [emphasis, setEmphasis] = useState(false);

  function addMemory() {
    const cleanMemory = memory.trim();

    const cleanSignificance = significance.trim();

    if (!cleanMemory) {
      return;
    }

    onChange([
      ...values,
      {
        memory: cleanMemory,
        significance: cleanSignificance,
        emphasis,
      },
    ]);

    setMemory("");
    setSignificance("");
    setEmphasis(false);
  }

  function removeMemory(indexToRemove: number) {
    onChange(values.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-2xl
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[1.5rem]
          border
          border-border/70
          bg-background/80
        "
      >
        <textarea
          value={memory}
          onChange={(event) => setMemory(event.target.value)}
          rows={4}
          placeholder="e.g. We moved to Lagos together when we were younger and struggled for years..."
          className="
            min-h-[140px]
            w-full
            resize-none
            bg-transparent
            px-5
            py-4
            text-[16px]
            font-medium
            leading-7
            outline-none

            placeholder:font-normal
            placeholder:text-muted-foreground/50
          "
        />

        <div
          className="
            border-t
            border-border/60
            p-4
          "
        >
          <label
            htmlFor="memory-significance"
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-muted-foreground
            "
          >
            Why does this memory matter?
          </label>

          <input
            id="memory-significance"
            value={significance}
            onChange={(event) => setSignificance(event.target.value)}
            placeholder="e.g. It shows his resilience and loyalty."
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
              transition-colors

              focus:border-mecho-purple/30
            "
          />

          <div
            className="
              mt-4
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <button
              type="button"
              onClick={() => setEmphasis((current) => !current)}
              className={`
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                transition-colors

                ${
                  emphasis
                    ? "text-mecho-purple"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Star
                className={`
                  size-4

                  ${emphasis ? "fill-mecho-purple" : ""}
                `}
              />
              Emphasize this memory
            </button>

            <button
              type="button"
              onClick={addMemory}
              disabled={!memory.trim()}
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

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <Plus className="size-4" />
              Add memory
            </button>
          </div>
        </div>
      </div>

      {values.length > 0 && (
        <div
          className="
            mt-5
            space-y-3
          "
        >
          {values.map((item, index) => (
            <div
              key={`${item.memory}-${index}`}
              className="
                  rounded-[1.25rem]
                  border
                  border-border/60
                  bg-background/70
                  p-4
                "
            >
              <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
              >
                <div className="min-w-0">
                  <div
                    className="
                        flex
                        items-center
                        gap-2
                      "
                  >
                    <p
                      className="
                          text-sm
                          font-medium
                          leading-6
                          text-foreground
                        "
                    >
                      {item.memory}
                    </p>

                    {item.emphasis && (
                      <Star
                        className="
                            size-3.5
                            shrink-0
                            fill-mecho-purple
                            text-mecho-purple
                          "
                      />
                    )}
                  </div>

                  {item.significance && (
                    <p
                      className="
                          mt-2
                          text-xs
                          leading-5
                          text-muted-foreground
                        "
                    >
                      {item.significance}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeMemory(index)}
                  aria-label="Remove memory"
                  className="
                      flex
                      size-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-muted-foreground
                      transition-colors

                      hover:bg-muted
                      hover:text-foreground
                    "
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
