import Image from "next/image";

interface LogoProps {
  compact?: boolean;
}

export default function Logo({ compact }: LogoProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-orange-500 sm:h-12 sm:w-12">
          <Image
            src="/logo.png"
            alt="LocalVoice AI"
            width={40}
            height={40}
            priority
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
        </div>

        <div>
          <h1 className="text-lg font-extrabold leading-none text-white sm:text-xl">
            LocalVoice
            <span className="text-orange-400"> AI</span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center sm:space-y-6">
      <Image
        src="/logo.png"
        alt="LocalVoice AI"
        width={96}
        height={96}
        priority
        className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
      />

      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">LocalVoice </span>
          <span className="text-orange-500">AI</span>
        </h1>

        <p className="mx-auto max-w-xs px-4 text-base leading-relaxed text-gray-400 sm:max-w-md sm:px-0 sm:text-lg">
          Transform once. Reach every audience.
        </p>
      </div>
    </div>
  );
}
