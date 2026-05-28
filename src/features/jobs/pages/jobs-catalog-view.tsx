import { CategorySwitcher } from "@/features/catalog/components/category-switcher";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import type { CatalogCategory } from "@/features/catalog/types/category";
import { Button } from "@/shared/components/button";
import { JobAllowanceFilterBar } from "../components/job-allowance-filter-bar";
import { JobsCatalogMainContent } from "../components/jobs-catalog-main-content";
import { JobsCatalogSidebarContent } from "../components/jobs-catalog-sidebar-content";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import { useJobsCatalogFilters } from "../hooks/use-jobs-catalog-filters";
import { usePublicJobCatalog } from "../hooks/use-public-job-catalog";
import { usePublicJobDetail } from "../hooks/use-public-job-detail";
import { useSelectedJob } from "../hooks/use-selected-job";

import "./jobs-catalog-view.css";

type JobsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function JobsCatalogView({
  category,
  onCategoryChange,
}: JobsCatalogViewProps) {
  const {
    data: jobs,
    loading: catalogLoading,
    error: catalogError,
  } = usePublicJobCatalog();

  const {
    search,
    selectedFeatureKeys,
    filteredJobs,
    hasActiveFilters,
    setSearch,
    toggleFeatureKey,
    clearFilters,
  } = useJobsCatalogFilters({
    jobs: jobs ?? [],
  });

  const {
    selectedJobId,
    selectedCatalogJob,
    selectJob,
    clearSelectedJob,
  } = useSelectedJob({
    jobs: filteredJobs,
  });

  const {
    job: selectedJob,
    loading: detailLoading,
    error: detailError,
  } = usePublicJobDetail(selectedJobId);

  function handleClearSelection() {
    clearSelectedJob();
    clearFilters();
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle={JOBS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={JOBS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={JOBS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div className="jobs-catalog-view__filters">
          <JobAllowanceFilterBar
            selectedFeatureKeys={selectedFeatureKeys}
            onToggleFeatureKey={toggleFeatureKey}
          />

          {hasActiveFilters ? (
            <Button variant="ghost" fullWidth onClick={clearFilters}>
              {JOBS_CATALOG_CONFIG.copy.filters.clearButtonLabel}
            </Button>
          ) : null}
        </div>
      }
      sidebarContent={
        <JobsCatalogSidebarContent
          loading={catalogLoading}
          error={catalogError}
          jobs={filteredJobs}
          selectedJobId={selectedJobId}
          onSelectJob={selectJob}
          onClearSelection={handleClearSelection}
        />
      }
      mainContent={
        <JobsCatalogMainContent
          loading={catalogLoading}
          error={catalogError}
          jobs={filteredJobs}
          selectedCatalogJob={selectedCatalogJob}
          selectedJob={selectedJob}
          detailLoading={detailLoading}
          detailError={detailError}
          hasActiveFilters={hasActiveFilters}
          onSelectJob={selectJob}
        />
      }
    />
  );
}