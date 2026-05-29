import { useCallback, useMemo, useState } from "react";

import {
  getSpellSourceName,
  isJobSpell,
  isMonsterSpell,
  isSpellOffensive,
  normalizeSpellText,
} from "../lib/spell-formatters";
import type { Spell } from "../types/spell";

export type SpellSourceFilter =
  | { type: "all" }
  | { type: "job"; jobName: string }
  | { type: "monster" };

type UseSpellsCatalogFiltersParams = {
  spells: readonly Spell[];
};

type UseSpellsCatalogFiltersResult = {
  search: string;
  sourceFilter: SpellSourceFilter;
  offensiveOnly: boolean;
  filteredSpells: Spell[];
  monsterSpellCount: number;
  jobSpellCounts: ReadonlyArray<{ jobName: string; count: number }>;
  setSearch: (value: string) => void;
  setOffensiveOnly: (value: boolean) => void;
  selectAllSources: () => void;
  selectMonsterSource: () => void;
  selectJobSource: (jobName: string) => void;
};

export function useSpellsCatalogFilters({
  spells,
}: UseSpellsCatalogFiltersParams): UseSpellsCatalogFiltersResult {
  const [search, setSearchRaw] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SpellSourceFilter>({
    type: "all",
  });
  const [offensiveOnly, setOffensiveOnly] = useState(false);

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setSourceFilter({ type: "all" });
  }, []);

  const selectAllSources = useCallback(() => {
    setSourceFilter({ type: "all" });
    setSearchRaw("");
  }, []);

  const selectMonsterSource = useCallback(() => {
    setSourceFilter({ type: "monster" });
    setSearchRaw("");
  }, []);

  const selectJobSource = useCallback((jobName: string) => {
    setSourceFilter({ type: "job", jobName });
    setSearchRaw("");
  }, []);

  const monsterSpellCount = useMemo(() => {
    return spells.filter((spell) => spell.nature === "monster").length;
  }, [spells]);

  const jobSpellCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const spell of spells) {
      if (!isJobSpell(spell)) continue;

      const jobName = spell.job_name?.trim();
      if (!jobName) continue;

      counts.set(jobName, (counts.get(jobName) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([jobName, count]) => ({ jobName, count }))
      .sort((a, b) => a.jobName.localeCompare(b.jobName));
  }, [spells]);

  const filteredSpells = useMemo(() => {
    const query = normalizeSpellText(search);

    return spells.filter((spell) => {
      const sourceName = getSpellSourceName(spell);

      const matchesSearch =
        !query || normalizeSpellText(sourceName).includes(query);

      const matchesSource =
        sourceFilter.type === "all" ||
        (sourceFilter.type === "monster" && isMonsterSpell(spell)) ||
        (sourceFilter.type === "job" &&
          isJobSpell(spell) &&
          spell.job_name?.trim() === sourceFilter.jobName);

      const matchesOffensive =
        !offensiveOnly || isSpellOffensive(spell.is_offensive);

      return matchesSearch && matchesSource && matchesOffensive;
    });
  }, [spells, search, sourceFilter, offensiveOnly]);

  return {
    search,
    sourceFilter,
    offensiveOnly,
    filteredSpells,
    monsterSpellCount,
    jobSpellCounts,
    setSearch,
    setOffensiveOnly,
    selectAllSources,
    selectMonsterSource,
    selectJobSource,
  };
}
