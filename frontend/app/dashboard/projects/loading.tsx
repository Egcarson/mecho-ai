import { CardGridSkeleton } from "@/components/dashboard/shared/card-grid-skeleton";

import { PageLoadingShell } from "@/components/dashboard/shared/page-loading-shell";

export default function Loading() {
  return (
    <PageLoadingShell>
      <PageHeaderSkeleton />

      <div className="mt-8">
        <CardGridSkeleton />
      </div>
    </PageLoadingShell>
  );
}

function PageHeaderSkeleton() {
  return (
    <div>
      <div
        className="
          h-8
          w-40
          rounded-full
          bg-muted
        "
      />

      <div
        className="
          mt-4
          h-4
          w-72
          max-w-full
          rounded-full
          bg-muted/70
        "
      />
    </div>
  );
}
