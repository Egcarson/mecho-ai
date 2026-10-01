import { GenerationViewerPage } from "@/components/dashboard/projects/generation-viewer-page";

type PageProps = {
  params: Promise<{
    projectUid: string;
    generationUid: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectUid, generationUid } = await params;

  return (
    <GenerationViewerPage
      projectUid={projectUid}
      generationUid={generationUid}
    />
  );
}
