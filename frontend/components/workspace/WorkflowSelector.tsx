"use client";

import { Megaphone, Landmark } from "lucide-react";
import WorkflowCard from "./WorkflowCard";

export type Workflow = "social" | "professional";

interface WorkflowSelectorProps {
  workflow: Workflow;
  onChange: (workflow: Workflow) => void;
}

export default function WorkflowSelector({
  workflow,
  onChange,
}: WorkflowSelectorProps) {
  return (
    <section className="mt-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <WorkflowCard
          title="Social Media Content"
          description="Create engaging multilingual content for businesses, brands, creators and marketing teams."
          icon={<Megaphone size={30} />}
          active={workflow === "social"}
          onClick={() => onChange("social")}
        />

        <WorkflowCard
          title="Professional Campaign"
          description="Generate formal campaigns for NGOs, government agencies, organizations and the general public."
          icon={<Landmark size={30} />}
          active={workflow === "professional"}
          onClick={() => onChange("professional")}
        />
      </div>
    </section>
  );
}
