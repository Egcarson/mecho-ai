interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-white/10">
      <div className="mb-6 inline-flex rounded-2xl bg-violet-600/20 p-4 text-violet-300">
        {icon}
      </div>

      <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>

      <p className="leading-7 text-gray-300">{description}</p>
    </div>
  );
}
