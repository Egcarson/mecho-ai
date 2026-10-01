import { PageLoadingShell } from "@/components/dashboard/shared/page-loading-shell";

import { SettingsSkeleton } from "@/components/dashboard/shared/settings-skeleton";

export default function Loading() {
  return (
    <PageLoadingShell>
      <div>
        <div
          className="
            h-9
            w-36
            rounded-full
            bg-muted
          "
        />

        <div
          className="
            mt-4
            h-4
            w-80
            max-w-full
            rounded-full
            bg-muted/70
          "
        />
      </div>

      <div className="mt-10">
        <SettingsSkeleton />
      </div>
    </PageLoadingShell>
  );
}
