import { useCallback, useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { MONSTERS_CATALOG_CONFIG } from "@/features/monsters/config/monsters-catalog-config";
import { usePublicMonsterSummary } from "@/features/monsters/hooks/use-public-monster-summary";
import { usePublicMonsterDetail } from "@/features/monsters/hooks/use-public-monster-detail";
import { useMonstersCatalogFilters } from "@/features/monsters/hooks/use-monsters-catalog-filters";
import { MonsterCardsPanel } from "@/features/monsters/components/monster-cards-panel";
import { MonsterDetailPanel } from "@/features/monsters/components/monster-detail-panel";
import { MonsterLevelFilter } from "@/features/monsters/components/monster-level-filter";
import { MonsterTypeFilter } from "@/features/monsters/components/monster-type-filter";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignMonsters } from "../hooks/use-campaign-monsters";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

import pageStyles from "@/features/monsters/pages/monsters-catalog-view.module.css";

type CampaignMonstersCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignMonstersCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignMonstersCatalogViewProps) {
  const global = usePublicMonsterSummary(true);
  const campaign = useCampaignMonsters(campaignId);
  const { data: monsters, loading, error } = useCombinedCatalog(global, campaign);
  const monstersList = useMemo(() => monsters ?? [], [monsters]);

  const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(
    null,
  );
  const {
    data: selectedMonster,
    loading: detailLoading,
    error: detailError,
  } = usePublicMonsterDetail(selectedMonsterId);

  const handleBackToList = useCallback(() => {
    setSelectedMonsterId(null);
  }, []);

  const {
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
  } = useMonstersCatalogFilters({
    monsters: monstersList,
    onFilterChange: handleBackToList,
  });

  function handleSelectMonster(monsterId: number) {
    setSelectedMonsterId(monsterId);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle={MONSTERS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={
        MONSTERS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle
      }
      searchPlaceholder={MONSTERS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div className={pageStyles.filterBlock}>
          <MonsterLevelFilter
            minLevel={minLevel}
            maxLevel={maxLevel}
            onMinLevelChange={setMinLevel}
            onMaxLevelChange={setMaxLevel}
          />

          <button
            type="button"
            aria-pressed={villainOnly}
            onClick={() => {
              toggleVillainOnly();
              scrollToTop();
            }}
            className={`${pageStyles.villainButton} ${villainOnly ? pageStyles.villainButtonActive : ""}`}
          >
            {MONSTERS_CATALOG_CONFIG.copy.sidebar.villainFilterLabel}
          </button>

          <button
            type="button"
            onClick={() => {
              resetFilters();
              scrollToTop();
            }}
            className={pageStyles.resetButton}
          >
            {MONSTERS_CATALOG_CONFIG.copy.sidebar.resetFiltersLabel}
          </button>
        </div>
      }
      sidebarContent={
        loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <MonsterTypeFilter
            typeCounts={typeCounts}
            selectedType={selectedType}
            totalCount={monstersList.length}
            onSelectType={(type) => {
              selectType(type);
              scrollToTop();
            }}
          />
        )
      }
      mainContent={
        loading ? (
          <LoadingState
            message={MONSTERS_CATALOG_CONFIG.copy.main.loadingMessage}
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : detailLoading ? (
          <LoadingState
            message={MONSTERS_CATALOG_CONFIG.copy.detail.loadingMessage}
          />
        ) : detailError ? (
          <ErrorState message={detailError} />
        ) : selectedMonster ? (
          <MonsterDetailPanel
            monster={selectedMonster}
            onBackToList={handleBackToList}
          />
        ) : (
          <MonsterCardsPanel
            monsters={filteredMonsters}
            selectedMonsterId={selectedMonsterId}
            onSelectMonster={handleSelectMonster}
          />
        )
      }
    />
  );
}
