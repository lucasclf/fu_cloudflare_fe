import { useMemo } from "react";
import { CatalogFilterButton } from "@/features/catalog/components/catalog-filter-button";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { SpellCardsPanel } from "@/features/spells/components/spell-cards-panel";
import { SpellOffensiveToggle } from "@/features/spells/components/spell-offensive-toggle";
import { SPELLS_CATALOG_CONFIG } from "@/features/spells/config/spells-catalog-config";
import { usePublicSpells } from "@/features/spells/hooks/use-public-spells";
import { useSpellsCatalogFilters } from "@/features/spells/hooks/use-spells-catalog-filters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignSpells } from "../hooks/use-campaign-spells";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

import styles from "@/features/spells/pages/spells-catalog-view.module.css";

type CampaignSpellsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignSpellsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignSpellsCatalogViewProps) {
  const global = usePublicSpells(true);
  const campaign = useCampaignSpells(campaignId);
  const { data: spells, loading, error } = useCombinedCatalog(global, campaign);
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
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
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
              onClick={() => {
                selectAllSources();
                scrollToTop();
              }}
            />

            <CatalogFilterButton
              label={SPELLS_CATALOG_CONFIG.copy.sidebar.monsterSourcesLabel}
              count={formatSpellCount(monsterSpellCount)}
              isActive={sourceFilter.type === "monster"}
              onClick={() => {
                selectMonsterSource();
                scrollToTop();
              }}
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
                onClick={() => {
                  selectJobSource(jobName);
                  scrollToTop();
                }}
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
          <LoadingState
            message={SPELLS_CATALOG_CONFIG.copy.main.loadingMessage}
          />
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
