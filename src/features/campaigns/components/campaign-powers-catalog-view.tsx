import { useMemo } from "react";
import { CatalogFilterButton } from "@/features/catalog/components/catalog-filter-button";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { POWERS_CATALOG_CONFIG } from "@/features/powers/config/powers-catalog-config";
import { PowerCardsPanel } from "@/features/powers/components/power-cards-panel";
import {
  PowerTypeFilter,
  type PowerTypeFilterValue,
} from "@/features/powers/components/power-type-filter";
import { usePublicPowers } from "@/features/powers/hooks/use-public-powers";
import {
  ALL_CLASSES_FILTER,
  UNRESTRICTED_CLASS_FILTER,
  usePowersCatalogFilters,
} from "@/features/powers/hooks/use-powers-catalog-filters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignPowers } from "../hooks/use-campaign-powers";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

import styles from "@/features/powers/pages/powers-catalog-view.module.css";

type CampaignPowersCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignPowersCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignPowersCatalogViewProps) {
  const global = usePublicPowers(true);
  const campaign = useCampaignPowers(campaignId);
  const { data: powers, loading, error } = useCombinedCatalog(global, campaign);
  const powersList = useMemo(() => powers ?? [], [powers]);

  const {
    search,
    selectedClassFilter,
    typeFilter,
    filteredPowers,
    classPowerCounts,
    unrestrictedPowerCount,
    setSearch,
    selectClassFilter,
    setTypeFilter,
  } = usePowersCatalogFilters({ powers: powersList });

  return (
    <CatalogLayout
      sidebarHeaderTitle={POWERS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={POWERS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={POWERS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <PowerTypeFilter
          value={typeFilter as PowerTypeFilterValue}
          onChange={setTypeFilter}
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
              label={POWERS_CATALOG_CONFIG.copy.sidebar.allClassesLabel}
              count={formatPowerCount(powersList.length)}
              isActive={selectedClassFilter === ALL_CLASSES_FILTER}
              onClick={() => {
                selectClassFilter(ALL_CLASSES_FILTER);
                scrollToTop();
              }}
            />

            {classPowerCounts.map(({ jobName, count }) => (
              <CatalogFilterButton
                key={jobName}
                label={jobName}
                count={formatPowerCount(count)}
                isActive={selectedClassFilter === jobName}
                onClick={() => {
                  selectClassFilter(jobName);
                  scrollToTop();
                }}
              />
            ))}

            <CatalogFilterButton
              label={POWERS_CATALOG_CONFIG.copy.sidebar.unrestrictedClassLabel}
              count={formatPowerCount(unrestrictedPowerCount)}
              isActive={selectedClassFilter === UNRESTRICTED_CLASS_FILTER}
              onClick={() => {
                selectClassFilter(UNRESTRICTED_CLASS_FILTER);
                scrollToTop();
              }}
            />

            <p className={styles.sidebarSummary}>
              Exibindo {filteredPowers.length} de {powersList.length} poderes.
            </p>
          </div>
        )
      }
      mainContent={
        loading ? (
          <LoadingState
            message={POWERS_CATALOG_CONFIG.copy.main.loadingMessage}
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <PowerCardsPanel powers={filteredPowers} />
        )
      }
    />
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatPowerCount(count: number): string {
  return `${count} ${count === 1 ? "poder" : "poderes"}`;
}
