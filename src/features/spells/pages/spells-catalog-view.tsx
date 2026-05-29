import { useMemo } from "react";
import { CatalogFilterButton } from "../../catalog/components/catalog-filter-button";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingState } from "../../../shared/components/loading-state";
import { SpellCardsPanel } from "../components/spell-cards-panel";
import { SpellOffensiveToggle } from "../components/spell-offensive-toggle";
import { SPELLS_CATALOG_CONFIG } from "../config/spells-catalog-config";
import { usePublicSpells } from "../hooks/use-public-spells";
import { useSpellsCatalogFilters } from "../hooks/use-spells-catalog-filters";

import styles from "./spells-catalog-view.module.css";

type SpellsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function SpellsCatalogView({
  category,
  onCategoryChange,
}: SpellsCatalogViewProps) {
  const { data: spells, loading, error } = usePublicSpells();
  const spellsList = useMemo(() => spells ?? [], [spells]);

  const {
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
  } = useSpellsCatalogFilters({ spells: spellsList });

  return (
    <CatalogLayout
      sidebarHeaderTitle={SPELLS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={SPELLS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={SPELLS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <SpellOffensiveToggle
          offensiveOnly={offensiveOnly}
          onChange={setOffensiveOnly}
        />
      }
      sidebarContent={
        loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className={styles.sidebarContent}>
            <CatalogFilterButton
              label={SPELLS_CATALOG_CONFIG.copy.sidebar.allSourcesLabel}
              count={formatSpellCount(spellsList.length)}
              isActive={sourceFilter.type === "all"}
              onClick={() => { selectAllSources(); scrollToTop(); }}
            />

            <CatalogFilterButton
              label={SPELLS_CATALOG_CONFIG.copy.sidebar.monsterSourcesLabel}
              count={formatSpellCount(monsterSpellCount)}
              isActive={sourceFilter.type === "monster"}
              onClick={() => { selectMonsterSource(); scrollToTop(); }}
            />

            {jobSpellCounts.map(({ jobName, count }) => (
              <CatalogFilterButton
                key={jobName}
                label={jobName}
                count={formatSpellCount(count)}
                isActive={
                  sourceFilter.type === "job" &&
                  sourceFilter.jobName === jobName
                }
                onClick={() => { selectJobSource(jobName); scrollToTop(); }}
              />
            ))}

            <p className={styles.sidebarSummary}>
              Exibindo {filteredSpells.length} de {spellsList.length} magias.
            </p>
          </div>
        )
      }
      mainContent={
        loading ? (
          <LoadingState message={SPELLS_CATALOG_CONFIG.copy.main.loadingMessage} />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <SpellCardsPanel spells={filteredSpells} />
        )
      }
    />
  );
}

function formatSpellCount(count: number): string {
  return `${count} ${count === 1 ? "magia" : "magias"}`;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
