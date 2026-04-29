import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicJobById } from "../api/get-public-job-by-id";
import { getPublicJobCatalog } from "../api/get-public-job-catalog";
import { JobAllowanceFilterBar } from "../components/job-allowance-filter-bar";
import {
  type JobFeatureFilterKey,
  getPositiveJobBonus,
  isJobAllowanceEnabled,
  isJobBonusKey,
} from "../components/job-allowance-icons";
import { JobCatalogPanel } from "../components/job-catalog-panel";
import { JobDetailPanel } from "../components/job-detail-panel";
import { JobListSidebar } from "../components/job-list-sidebar";
import { normalizeText } from "../lib/job-formatters";
import type { Job, JobCatalogItem } from "../types/job";

type JobsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function JobsCatalogView({
  category,
  onCategoryChange,
}: JobsCatalogViewProps) {
  const [jobs, setJobs] = useState<JobCatalogItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFeatureKeys, setSelectedFeatureKeys] = useState<
    JobFeatureFilterKey[]
  >([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        setCatalogError(null);
        const data = await getPublicJobCatalog();
        setJobs(data);
      } catch {
        setCatalogError("Não foi possível carregar as classes.");
      } finally {
        setCatalogLoading(false);
      }
    }

    void loadCatalog();
  }, []);

  useEffect(() => {
    if (selectedJobId === null) {
      setSelectedJob(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    async function loadJobDetail(jobId: number) {
      try {
        setDetailLoading(true);
        setDetailError(null);
        const data = await getPublicJobById(jobId);
        setSelectedJob(data);
      } catch {
        setDetailError("Não foi possível carregar os detalhes da classe.");
      } finally {
        setDetailLoading(false);
      }
    }

    void loadJobDetail(selectedJobId);
  }, [selectedJobId]);

  const filteredJobs = useMemo(() => {
    const query = normalizeText(search);

    return jobs.filter((job) => {
      const name = normalizeText(job.name);
      const tagline = normalizeText(job.tagline ?? "");

      const matchesSearch =
        !query || name.includes(query) || tagline.includes(query);

      const matchesFeatures = selectedFeatureKeys.every((key) => {
        if (isJobBonusKey(key)) {
          return getPositiveJobBonus(job[key]) > 0;
        }

        return isJobAllowanceEnabled(job[key]);
      });

      return matchesSearch && matchesFeatures;
    });
  }, [jobs, search, selectedFeatureKeys]);

  function handleSelectJob(jobId: number) {
    setSelectedJobId(jobId);
  }

  function handleClearSelection() {
    setSelectedJobId(null);
    setSelectedJob(null);
    setSearch("");
    setSelectedFeatureKeys([]);
  }

  function handleToggleFeatureKey(key: JobFeatureFilterKey) {
    setSelectedFeatureKeys((current) =>
      current.includes(key)
        ? current.filter((currentKey) => currentKey !== key)
        : [...current, key],
    );
  }

  const selectedCatalogJob = useMemo(() => {
    if (selectedJobId === null) {
      return null;
    }

    return filteredJobs.find((job) => job.id === selectedJobId) ?? null;
  }, [filteredJobs, selectedJobId]);

  return (
    <CatalogLayout
      sidebarHeaderTitle="Classes"
      sidebarHeaderSubtitle="Classes de personagem"
      searchPlaceholder="Buscar classe..."
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <JobAllowanceFilterBar
          selectedFeatureKeys={selectedFeatureKeys}
          onToggleFeatureKey={handleToggleFeatureKey}
        />
      }
      sidebarContent={
        catalogLoading ? (
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : catalogError ? (
          <div style={{ padding: "16px" }}>{catalogError}</div>
        ) : (
          <JobListSidebar
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            onSelect={handleSelectJob}
            onClearSelection={handleClearSelection}
          />
        )
      }
      mainContent={
        catalogLoading ? (
          <div>Carregando classes...</div>
        ) : catalogError ? (
          <div>{catalogError}</div>
        ) : selectedCatalogJob ? (
          <JobDetailPanel
            job={selectedJob ?? selectedCatalogJob}
            loading={detailLoading}
            error={detailError}
          />
        ) : (
          <JobCatalogPanel jobs={filteredJobs} onSelect={handleSelectJob} />
        )
      }
    />
  );
}
