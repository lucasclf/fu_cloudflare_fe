import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
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
  onBackToList?: () => void;
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
  onBackToList,
}: JobsCatalogMainContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={JOBS_CATALOG_CONFIG.copy.main.loadingMessage}
      emptyState={{
        isEmpty: selectedCatalogJob === null && jobs.length === 0,
        title: JOBS_CATALOG_CONFIG.copy.emptyState.title,
        description: hasActiveFilters
          ? JOBS_CATALOG_CONFIG.copy.emptyState.descriptionWithFilters
          : JOBS_CATALOG_CONFIG.copy.emptyState.descriptionWithoutFilters,
      }}
    >
      {selectedCatalogJob ? (
        <JobDetailPanel
          job={selectedJob ?? selectedCatalogJob}
          loading={detailLoading}
          error={detailError}
          onBackToList={onBackToList}
        />
      ) : (
        <JobCatalogPanel jobs={jobs} onSelect={onSelectJob} />
      )}
    </CatalogStateBoundary>
  );
}
