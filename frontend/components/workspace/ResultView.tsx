import OutputHeader from "./OutputHeader";
import LanguageSection from "./LanguageSection";

import { GenerateResponse } from "@/types/result";

interface ResultViewProps {
  result: GenerateResponse;
  onBack: () => void;
}

export default function ResultView({ result, onBack }: ResultViewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <OutputHeader onGenerateAgain={onBack} />

      {result.generated.map((group) => (
        <LanguageSection
          key={group.language}
          language={group.language}
          contents={group.contents}
        />
      ))}
    </div>
  );
}
