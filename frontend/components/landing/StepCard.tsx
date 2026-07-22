interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function StepCard({
  number,
  title,
  description,
  icon,
}: StepCardProps) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-orange-500 font-bold text-white">
        {number}
      </div>

      <div className="mt-6 mb-6 text-violet-300">{icon}</div>

      <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>

      <p className="text-gray-400 leading-7">{description}</p>
    </div>
  );
}
