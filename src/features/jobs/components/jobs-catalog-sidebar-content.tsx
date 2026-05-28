import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { JobCatalogItem } from "../types/job";
import { JobListSidebar } from "./job-list-sidebar";

type JobsCatalogSidebarContentProps = {
  loading: boolean;
  error: string | null;
  jobs: JobCatalogItem[];
  selectedJobId: number | null;
  onSelectJob: (jobId: number) => void;
  onClearSelection: () => void;
};

export function JobsCatalogSidebarContent({
  loading,
  error,
  jobs,
  selectedJobId,
  onSelectJob,
  onClearSelection,
}: JobsCatalogSidebarContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={JOBS_CATALOG_CONFIG.copy.sidebar.loadingMessage}
    >
      <JobListSidebar
        jobs={jobs}
        selectedJobId={selectedJobId}
        onSelect={onSelectJob}
        onClearSelection={onClearSelection}
      />
    </CatalogStateBoundary>
  );
}
