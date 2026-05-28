import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { Job, JobCatalogItem } from "../types/job";
import { JobCatalogPanel } from "./job-catalog-panel";
import { JobDetailPanel } from "./job-detail-panel";

type JobsCatalogMainContentProps = {
  loading: boolean;
  error: string | null;
  jobs: JobCatalogItem[];
  selectedCatalogJob: JobCatalogItem | null;
  selectedJob: Job | null;
  detailLoading: boolean;
  detailError: string | null;
  hasActiveFilters: boolean;
  onSelectJob: (jobId: number) => void;
};

export function JobsCatalogMainContent({
  loading,
  error,
  jobs,
  selectedCatalogJob,
  selectedJob,
  detailLoading,
  detailError,
  hasActiveFilters,
  onSelectJob,
}: JobsCatalogMainContentProps) {
  if (loading) {
    return <LoadingState message={JOBS_CATALOG_CONFIG.copy.main.loadingMessage} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (selectedCatalogJob) {
    return (
      <JobDetailPanel
        job={selectedJob ?? selectedCatalogJob}
        loading={detailLoading}
        error={detailError}
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title={JOBS_CATALOG_CONFIG.copy.emptyState.title}
        description={
          hasActiveFilters
            ? JOBS_CATALOG_CONFIG.copy.emptyState.descriptionWithFilters
            : JOBS_CATALOG_CONFIG.copy.emptyState.descriptionWithoutFilters
        }
      />
    );
  }

  return <JobCatalogPanel jobs={jobs} onSelect={onSelectJob} />;
}