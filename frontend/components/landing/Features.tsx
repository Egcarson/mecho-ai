import { BrainCircuit, Globe2, LayoutGrid } from "lucide-react";
import Container from "@/components/shared/Container";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
            Why LocalVoice AI?
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-white">
            Everything you need to create
            <span className="bg-linear-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              high-impact campaigns
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Built for creators, businesses, NGOs and marketing teams that want
            to reach more people in less time.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <FeatureCard
            icon={<BrainCircuit size={32} />}
            title="AI Content Analysis"
            description="Our AI first understands your document or campaign brief before generating tailored content for every platform."
          />

          <FeatureCard
            icon={<Globe2 size={32} />}
            title="Multilingual Content"
            description="Generate campaigns in English, Yoruba, Igbo, Hausa and Nigerian Pidgin with a single click."
          />

          <FeatureCard
            icon={<LayoutGrid size={32} />}
            title="Multi-Platform Ready"
            description="Create optimized content for Instagram, Facebook, LinkedIn, X, TikTok, WhatsApp, Email and YouTube."
          />
        </div>
      </Container>
    </section>
  );
}
