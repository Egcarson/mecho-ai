export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {["profile", "preferences", "security"].map((section) => (
        <section
          key={section}
          className="
            rounded-[1.75rem]
            border
            border-border/60
            bg-background
            p-5

            sm:p-7
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <div
                className="
                  h-5
                  w-32
                  rounded-full
                  bg-muted
                "
              />

              <div
                className="
                  mt-3
                  h-3
                  w-64
                  max-w-full
                  rounded-full
                  bg-muted/70
                "
              />
            </div>

            <div
              className="
                h-9
                w-24
                rounded-full
                bg-muted
              "
            />
          </div>

          <div
            className="
              mt-7
              grid
              gap-5

              md:grid-cols-2
            "
          >
            {Array.from({
              length: section === "security" ? 2 : 4,
            }).map((_, index) => (
              <div key={index}>
                <div
                  className="
                      h-3
                      w-24
                      rounded-full
                      bg-muted/70
                    "
                />

                <div
                  className="
                      mt-2
                      h-11
                      w-full
                      rounded-xl
                      bg-muted
                    "
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
