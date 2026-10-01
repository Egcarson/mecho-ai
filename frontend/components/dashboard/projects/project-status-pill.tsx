type ProjectStatusPillProps = {
  status: string;
};

export function ProjectStatusPill({ status }: ProjectStatusPillProps) {
  return (
    <span
      className="
        rounded-full
        bg-muted/60
        px-2.5
        py-1
        text-[10px]
        font-medium
        capitalize
        text-muted-foreground
      "
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
