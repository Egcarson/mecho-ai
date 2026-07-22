import Container from "@/components/shared/Container";
import StepCard from "./StepCard";
import { Upload, Settings2, Sparkles } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
            Simple Process
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-white">
            Create Campaigns in
            <span className="bg-linear-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              3 Easy Steps
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            From your idea to ready-to-publish campaigns in minutes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <StepCard
            number="1"
            icon={<Upload size={32} />}
            title="Upload"
            description="Upload a PDF, paste existing content, or describe your campaign idea."
          />

          <StepCard
            number="2"
            icon={<Settings2 size={32} />}
            title="Configure"
            description="Choose your platforms, audience, language, and preferred writing tone."
          />

          <StepCard
            number="3"
            icon={<Sparkles size={32} />}
            title="Generate"
            description="LocalVoice AI instantly creates optimized content ready for publishing."
          />
        </div>
      </Container>
    </section>
  );
}
