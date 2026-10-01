import Link from "next/link";
import { Archive, FolderOpen, Plus, SearchX } from "lucide-react";

type ProjectEmptyStateProps = {
  hasAnyProjects: boolean;
  hasSearch: boolean;
  showArchived: boolean;
};

export function ProjectEmptyState({
  hasAnyProjects,
  hasSearch,
  showArchived,
}: ProjectEmptyStateProps) {
  const Icon = showArchived ? Archive : hasSearch ? SearchX : FolderOpen;

  let title = "No projects yet.";

  let description = "Create something with Mecho and it will appear here.";

  if (hasAnyProjects && hasSearch) {
    title = "No matching projects.";

    description = "Try a different search or workflow filter.";
  }

  if (showArchived) {
    title = "No archived projects.";

    description = "Projects you archive will appear here.";
  }

  return (
    <div
      className="
        mt-12
        flex
        min-h-[320px]
        flex-col
        items-center
        justify-center
        rounded-[1.75rem]
        border
        border-dashed
        border-border/70
        px-6
        text-center
      "
    >
      <div
        className="
          flex
          size-12
          items-center
          justify-center
          rounded-2xl
          bg-muted/60
          text-muted-foreground
        "
      >
        <Icon className="size-5" />
      </div>

      <h2
        className="
          mt-5
          text-xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>

      {!hasAnyProjects && !showArchived && (
        <Link
          href="/dashboard/create"
          className="
              mt-6
              inline-flex
              h-10
              items-center
              gap-2
              rounded-full
              bg-foreground
              px-5
              text-sm
              font-medium
              text-background
            "
        >
          <Plus className="size-4" />
          Create something
        </Link>
      )}
    </div>
  );
}
