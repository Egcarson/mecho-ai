export function AmbientBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[10%]
          top-[20%]
          size-[360px]
          rounded-full
          bg-mecho-purple/8
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[10%]
          right-[8%]
          size-[320px]
          rounded-full
          bg-mecho-orange/7
          blur-[140px]
        "
      />
    </>
  );
}
