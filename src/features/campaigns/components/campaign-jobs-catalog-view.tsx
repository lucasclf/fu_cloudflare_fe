import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { CatalogSearchExtra } from "@/features/catalog/components/catalog-search-extra";
import { JobAllowanceFilterBar } from "@/features/jobs/components/job-allowance-filter-bar";
import { JobsCatalogMainContent } from "@/features/jobs/components/jobs-catalog-main-content";
import { JobsCatalogSidebarContent } from "@/features/jobs/components/jobs-catalog-sidebar-content";
import { JOBS_CATALOG_CONFIG } from "@/features/jobs/config/jobs-catalog-config";
import { useJobsCatalogFilters } from "@/features/jobs/hooks/use-jobs-catalog-filters";
import { usePublicJobCatalog } from "@/features/jobs/hooks/use-public-job-catalog";
import { usePublicJobDetail } from "@/features/jobs/hooks/use-public-job-detail";
import { useSelectedJob } from "@/features/jobs/hooks/use-selected-job";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignJobs } from "../hooks/use-campaign-jobs";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

type CampaignJobsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignJobsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignJobsCatalogViewProps) {
  const global = usePublicJobCatalog(true);
  const campaign = useCampaignJobs(campaignId);
  const {
    data: jobs,
    loading: catalogLoading,
    error: catalogError,
  } = useCombinedCatalog(global, campaign);

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

  const { selectedJobId, selectedCatalogJob, selectJob, clearSelectedJob } =
    useSelectedJob({
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

  function handleSelectJob(jobId: number) {
    selectJob(jobId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle={JOBS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={JOBS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={JOBS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <CatalogSearchExtra
          hasActiveFilters={hasActiveFilters}
          clearButtonLabel={JOBS_CATALOG_CONFIG.copy.filters.clearButtonLabel}
          onClearFilters={clearFilters}
        >
          <JobAllowanceFilterBar
            selectedFeatureKeys={selectedFeatureKeys}
            onToggleFeatureKey={toggleFeatureKey}
          />
        </CatalogSearchExtra>
      }
      sidebarContent={
        <JobsCatalogSidebarContent
          loading={catalogLoading}
          error={catalogError}
          jobs={filteredJobs}
          selectedJobId={selectedJobId}
          onSelectJob={handleSelectJob}
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
          onBackToList={clearSelectedJob}
        />
      }
    />
  );
}
