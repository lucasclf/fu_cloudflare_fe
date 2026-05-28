import {
  ListSidebar,
  type ListSidebarItem,
} from "@/shared/components/list-sidebar";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { JobCatalogItem } from "../types/job";

type JobListSidebarProps = {
  jobs: JobCatalogItem[];
  selectedJobId: number | null;
  onSelect: (jobId: number) => void;
  onClearSelection: () => void;
};

export function JobListSidebar({
  jobs,
  selectedJobId,
  onSelect,
  onClearSelection,
}: JobListSidebarProps) {
  const items: ListSidebarItem<number>[] = jobs.map((job) => ({
    id: job.id,
    title: job.name,
    subtitle: job.tagline ?? undefined,
  }));

  return (
    <ListSidebar
      ariaLabel={JOBS_CATALOG_CONFIG.copy.sidebar.listAriaLabel}
      items={items}
      selectedItemId={selectedJobId}
      clearSelectionLabel={JOBS_CATALOG_CONFIG.copy.sidebar.showAllButtonLabel}
      emptyMessage={JOBS_CATALOG_CONFIG.copy.sidebar.emptyMessage}
      onSelect={onSelect}
      onClearSelection={onClearSelection}
    />
  );
}
