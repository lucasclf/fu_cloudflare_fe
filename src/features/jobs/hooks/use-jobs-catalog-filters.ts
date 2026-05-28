import { useCallback, useMemo, useState } from "react";

import { filterJobs } from "../lib/filter-jobs";
import type { JobFeatureFilterKey } from "../lib/job-feature-filters";
import type { JobCatalogItem } from "../types/job";

type UseJobsCatalogFiltersParams = {
  jobs: readonly JobCatalogItem[];
};

type UseJobsCatalogFiltersResult = {
  search: string;
  selectedFeatureKeys: JobFeatureFilterKey[];
  filteredJobs: JobCatalogItem[];
  hasActiveFilters: boolean;
  setSearch: (search: string) => void;
  toggleFeatureKey: (key: JobFeatureFilterKey) => void;
  clearFilters: () => void;
};

export function useJobsCatalogFilters({
  jobs,
}: UseJobsCatalogFiltersParams): UseJobsCatalogFiltersResult {
  const [search, setSearch] = useState("");
  const [selectedFeatureKeys, setSelectedFeatureKeys] = useState<
    JobFeatureFilterKey[]
  >([]);

  const filteredJobs = useMemo(() => {
    return filterJobs({
      jobs,
      search,
      selectedFeatureKeys,
    });
  }, [jobs, search, selectedFeatureKeys]);

  const hasActiveFilters = useMemo(() => {
    return search.trim().length > 0 || selectedFeatureKeys.length > 0;
  }, [search, selectedFeatureKeys]);

  const toggleFeatureKey = useCallback((key: JobFeatureFilterKey) => {
    setSelectedFeatureKeys((current) =>
      current.includes(key)
        ? current.filter((currentKey) => currentKey !== key)
        : [...current, key],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedFeatureKeys([]);
  }, []);

  return {
    search,
    selectedFeatureKeys,
    filteredJobs,
    hasActiveFilters,
    setSearch,
    toggleFeatureKey,
    clearFilters,
  };
}