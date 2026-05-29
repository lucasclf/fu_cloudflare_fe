import { useMemo } from "react";
import { CatalogFilterButton } from "../../catalog/components/catalog-filter-button";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingState } from "../../../shared/components/loading-state";
import { POWERS_CATALOG_CONFIG } from "../config/powers-catalog-config";
import { PowerCardsPanel } from "../components/power-cards-panel";
import {
  PowerTypeFilter,
  type PowerTypeFilterValue,
} from "../components/power-type-filter";
import { usePublicPowers } from "../hooks/use-public-powers";
import {
  ALL_CLASSES_FILTER,
  UNRESTRICTED_CLASS_FILTER,
  usePowersCatalogFilters,
} from "../hooks/use-powers-catalog-filters";

import styles from "./powers-catalog-view.module.css";

type PowersCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function PowersCatalogView({
  category,
  onCategoryChange,
}: PowersCatalogViewProps) {
  const { data: powers, loading, error } = usePublicPowers();
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
        <CategorySwitcher value={category} onChange={onCategoryChange} />
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
