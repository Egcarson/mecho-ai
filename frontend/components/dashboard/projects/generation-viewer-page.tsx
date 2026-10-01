"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import {
  getProject,
  getProjectGeneration,
  type ProjectDetail,
  type ProjectGeneration,
} from "@/lib/projects";

import { GenerationViewerHeader } from "./generation-viewer-header";
import { UnsupportedGenerationView } from "./unsupported-generation-view";

import { SocialResult } from "@/components/dashboard/create/social/social-result";
import { CampaignResult } from "@/components/dashboard/create/campaign/campaign-result";
import { SpeechResult } from "@/components/dashboard/create/speech/speech-result";

type GenerationViewerPageProps = {
  projectUid: string;
  generationUid: string;
};

export function GenerationViewerPage({
  projectUid,
  generationUid,
}: GenerationViewerPageProps) {
  const router = useRouter();

  const [project, setProject] = useState<ProjectDetail | null>(null);

  const [generation, setGeneration] = useState<ProjectGeneration | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      try {
        const [projectResponse, generationResponse] = await Promise.all([
          getProject(projectUid),

          getProjectGeneration(projectUid, generationUid),
        ]);

        if (cancelled) {
          return;
        }

        setProject(projectResponse);

        setGeneration(generationResponse);
      } catch (error) {
        if (cancelled) {
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "Couldn't load generation.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [projectUid, generationUid]);

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
          "
        >
          <Loader2
            className="
              size-4
              animate-spin
            "
          />
          Loading generation...
        </div>
      </div>
    );
  }

  if (!project || !generation) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          px-4
          text-center
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Generation not found
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            This generation may have been deleted or is no longer available.
          </p>

          <button
            type="button"
            onClick={() => router.push(`/dashboard/projects/${projectUid}`)}
            className="
              mt-6
              inline-flex
              h-10
              items-center
              justify-center
              rounded-full
              border
              border-border/60
              px-5
              text-sm
              font-medium
              transition-colors

              hover:bg-muted/50
            "
          >
            Back to project
          </button>
        </div>
      </div>
    );
  }

  const workflow = project.workflow.toLowerCase();

  const handleBack = () => {
    router.push(`/dashboard/projects/${projectUid}`);
  };

  /*
   * =====================================================
   * SOCIAL
   * =====================================================
   */

  if (workflow === "social") {
    return (
      <SocialResult
        generation={generation}
        backLabel="Back to project"
        onBack={handleBack}
      />
    );
  }

  /*
   * =====================================================
   * CAMPAIGN
   * =====================================================
   */

  if (workflow === "campaign") {
    return (
      <CampaignResult
        generation={generation}
        backLabel="Back to project"
        onBack={handleBack}
      />
    );
  }

  /*
   * =====================================================
   * SPEECH
   * =====================================================
   */

  if (workflow === "speech") {
    const speechLanguage = project.languages?.[0] ?? "";

    return (
      <main
        className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-16
        pt-8

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pt-12
      "
      >
        <GenerationViewerHeader
          project={project}
          generation={generation}
          compact
        />

        <SpeechResult
          generation={generation}
          language={speechLanguage}
          backLabel="Back to project"
          onBack={handleBack}
        />
      </main>
    );
  }

  /*
   * =====================================================
   * UNKNOWN / FUTURE WORKFLOW
   * =====================================================
   */

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-16
        pt-8

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pt-12
      "
    >
      <GenerationViewerHeader project={project} generation={generation} />

      <UnsupportedGenerationView workflow={project.workflow} />
    </main>
  );
}
