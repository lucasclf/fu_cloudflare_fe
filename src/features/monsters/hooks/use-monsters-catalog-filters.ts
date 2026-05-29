import { useCallback, useMemo, useState } from "react";

import {
  getMonsterTypeCounts,
  isMonsterVillain,
  normalizeMonsterText,
} from "../lib/monster-formatters";
import type { MonsterSummary } from "../types/monster";

type UseMonstersCatalogFiltersParams = {
  monsters: readonly MonsterSummary[];
  onFilterChange?: () => void;
};

type UseMonstersCatalogFiltersResult = {
  search: string;
  selectedType: string | null;
  minLevel: string;
  maxLevel: string;
  villainOnly: boolean;
  filteredMonsters: MonsterSummary[];
  typeCounts: ReturnType<typeof getMonsterTypeCounts>;
  setSearch: (value: string) => void;
  selectType: (type: string | null) => void;
  setMinLevel: (value: string) => void;
  setMaxLevel: (value: string) => void;
  toggleVillainOnly: () => void;
  resetFilters: () => void;
};

export function useMonstersCatalogFilters({
  monsters,
  onFilterChange,
}: UseMonstersCatalogFiltersParams): UseMonstersCatalogFiltersResult {
  const [search, setSearchRaw] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [minLevel, setMinLevelRaw] = useState("");
  const [maxLevel, setMaxLevelRaw] = useState("");
  const [villainOnly, setVillainOnly] = useState(false);

  const setSearch = useCallback(
    (value: string) => {
      setSearchRaw(value);
      setSelectedType(null);
      setMinLevelRaw("");
      setMaxLevelRaw("");
      setVillainOnly(false);
      onFilterChange?.();
    },
    [onFilterChange],
  );

  const selectType = useCallback(
    (type: string | null) => {
      setSelectedType(type);
      setSearchRaw("");
      onFilterChange?.();
    },
    [onFilterChange],
  );

  const setMinLevel = useCallback(
    (value: string) => {
      setMinLevelRaw(value);
      setSearchRaw("");
      onFilterChange?.();
    },
    [onFilterChange],
  );

  const setMaxLevel = useCallback(
    (value: string) => {
      setMaxLevelRaw(value);
      setSearchRaw("");
      onFilterChange?.();
    },
    [onFilterChange],
  );

  const toggleVillainOnly = useCallback(() => {
    setVillainOnly((current) => !current);
    setSearchRaw("");
    onFilterChange?.();
  }, [onFilterChange]);

  const resetFilters = useCallback(() => {
    setSearchRaw("");
    setSelectedType(null);
    setMinLevelRaw("");
    setMaxLevelRaw("");
    setVillainOnly(false);
    onFilterChange?.();
  }, [onFilterChange]);

  const typeCounts = useMemo(() => {
    return getMonsterTypeCounts(monsters);
  }, [monsters]);

  const filteredMonsters = useMemo(() => {
    const query = normalizeMonsterText(search);
    const min = minLevel.trim() === "" ? null : Number(minLevel);
    const max = maxLevel.trim() === "" ? null : Number(maxLevel);

    return monsters.filter((monster) => {
      const matchesSearch =
        !query || normalizeMonsterText(monster.name).includes(query);

      const matchesType =
        selectedType === null || monster.monster_type === selectedType;

      const matchesMin =
        min === null || !Number.isFinite(min) || monster.level >= min;

      const matchesMax =
        max === null || !Number.isFinite(max) || monster.level <= max;

      const matchesVillain =
        !villainOnly || isMonsterVillain(monster.is_villain);

      return (
        matchesSearch &&
        matchesType &&
        matchesMin &&
        matchesMax &&
        matchesVillain
      );
    });
  }, [monsters, search, selectedType, minLevel, maxLevel, villainOnly]);

  return {
    search,
    selectedType,
    minLevel,
    maxLevel,
    villainOnly,
    filteredMonsters,
    typeCounts,
    setSearch,
    selectType,
    setMinLevel,
    setMaxLevel,
    toggleVillainOnly,
    resetFilters,
  };
}
