import { ProjectDetailPage } from "@/components/dashboard/projects/detail/project-detail-page";

type PageProps = {
  params: Promise<{
    projectUid: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectUid } = await params;

  return <ProjectDetailPage projectUid={projectUid} />;
}
