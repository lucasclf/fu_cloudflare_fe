import { useCallback, useMemo, useState } from "react";

import {
  getPowerJobNames,
  isPowerUnrestricted,
  normalizePowerText,
} from "../lib/power-formatters";
import type { Power } from "../types/power";
import type { PowerTypeFilterValue } from "../components/power-type-filter";

export const ALL_CLASSES_FILTER = "__ALL_CLASSES__";
export const UNRESTRICTED_CLASS_FILTER = "__UNRESTRICTED_CLASS__";

export type ClassFilterValue =
  | typeof ALL_CLASSES_FILTER
  | typeof UNRESTRICTED_CLASS_FILTER
  | string;

type UsePowersCatalogFiltersParams = {
  powers: readonly Power[];
};

type UsePowersCatalogFiltersResult = {
  search: string;
  selectedClassFilter: ClassFilterValue;
  typeFilter: PowerTypeFilterValue;
  filteredPowers: Power[];
  classPowerCounts: ReadonlyArray<{ jobName: string; count: number }>;
  unrestrictedPowerCount: number;
  setSearch: (value: string) => void;
  selectClassFilter: (value: ClassFilterValue) => void;
  setTypeFilter: (value: PowerTypeFilterValue) => void;
};

export function usePowersCatalogFilters({
  powers,
}: UsePowersCatalogFiltersParams): UsePowersCatalogFiltersResult {
  const [search, setSearchRaw] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] =
    useState<ClassFilterValue>(ALL_CLASSES_FILTER);
  const [typeFilter, setTypeFilter] = useState<PowerTypeFilterValue>(null);

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setSelectedClassFilter(ALL_CLASSES_FILTER);
  }, []);

  const selectClassFilter = useCallback((value: ClassFilterValue) => {
    setSelectedClassFilter(value);
    setSearchRaw("");
  }, []);

  const classPowerCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const power of powers) {
      const jobNames = getPowerJobNames(power);

      for (const jobName of jobNames) {
        const normalizedJobName = jobName.trim();
        if (!normalizedJobName) continue;

        counts.set(normalizedJobName, (counts.get(normalizedJobName) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([jobName, count]) => ({ jobName, count }))
      .sort((a, b) => a.jobName.localeCompare(b.jobName));
  }, [powers]);

  const unrestrictedPowerCount = useMemo(() => {
    return powers.filter((power) => isPowerUnrestricted(power)).length;
  }, [powers]);

  const filteredPowers = useMemo(() => {
    const query = normalizePowerText(search);

    return powers.filter((power) => {
      const jobNames = getPowerJobNames(power);

      const matchesSearch =
        !query ||
        normalizePowerText(power.name).includes(query) ||
        normalizePowerText(power.description).includes(query);

      const matchesClass =
        selectedClassFilter === ALL_CLASSES_FILTER ||
        (selectedClassFilter === UNRESTRICTED_CLASS_FILTER &&
          isPowerUnrestricted(power)) ||
        jobNames.includes(selectedClassFilter);

      const matchesType = typeFilter === null || power.type === typeFilter;

      return matchesSearch && matchesClass && matchesType;
    });
  }, [powers, search, selectedClassFilter, typeFilter]);

  return {
    search,
    selectedClassFilter,
    typeFilter,
    filteredPowers,
    classPowerCounts,
    unrestrictedPowerCount,
    setSearch,
    selectClassFilter,
    setTypeFilter,
  };
}
