interface WorkflowCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function WorkflowCard({
  title,
  description,
  icon,
  active,
  onClick,
}: WorkflowCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
        active
          ? "border-violet-500 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:border-violet-500/40 hover:bg-white/10"
      }`}
    >
      <div className="mb-5 inline-flex rounded-2xl bg-violet-500/10 p-3 text-violet-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-2 text-gray-400">{description}</p>
    </button>
  );
}
