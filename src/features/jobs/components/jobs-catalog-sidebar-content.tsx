import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
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
  if (loading) {
    return (
      <LoadingState message={JOBS_CATALOG_CONFIG.copy.sidebar.loadingMessage} />
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <JobListSidebar
      jobs={jobs}
      selectedJobId={selectedJobId}
      onSelect={onSelectJob}
      onClearSelection={onClearSelection}
    />
  );
}