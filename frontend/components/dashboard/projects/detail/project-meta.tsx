import { Languages, MessageSquareText, Target, Users } from "lucide-react";

import type { ProjectDetail } from "@/lib/projects";

type ProjectMetaProps = {
  project: ProjectDetail;
};

export function ProjectMeta({ project }: ProjectMetaProps) {
  return (
    <section
      className="
        mt-10
        grid
        gap-3

        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      <MetaItem
        icon={Target}
        label="Objective"
        value={project.objective ? formatLabel(project.objective) : "—"}
      />

      <MetaItem
        icon={MessageSquareText}
        label="Tone"
        value={project.tone ? formatLabel(project.tone) : "—"}
      />

      <MetaItem
        icon={Users}
        label="Audience"
        value={project.audiences.length ? project.audiences.join(", ") : "—"}
      />

      <MetaItem
        icon={Languages}
        label="Languages"
        value={
          project.languages.length
            ? project.languages.map(formatLabel).join(", ")
            : "—"
        }
      />
    </section>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-[1.25rem]
        border
        border-border/60
        bg-background/60
        p-4
      "
    >
      <div
        className="
          flex
          size-8
          items-center
          justify-center
          rounded-lg
          bg-muted/60
          text-muted-foreground
        "
      >
        <Icon className="size-4" />
      </div>

      <p
        className="
          mt-4
          text-xs
          text-muted-foreground
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          line-clamp-2
          text-sm
          font-medium
        "
      >
        {value}
      </p>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
