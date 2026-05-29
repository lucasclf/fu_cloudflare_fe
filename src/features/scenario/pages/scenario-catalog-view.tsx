import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingState } from "../../../shared/components/loading-state";
import { getPublicScenarioEntities } from "../api/get-public-scenario-entities";
import { SCENARIO_CATALOG_CONFIG } from "../config/scenario-catalog-config";
import pageStyles from "./scenario-catalog-view.module.css";
import { ScenarioCardsPanel } from "../components/scenario-cards-panel";
import { ScenarioSidebar } from "../components/scenario-sidebar";
import { ScenarioDetailPanel } from "../components/scenario-detail-panel";
import {
  ScenarioTypeFilter,
  type ScenarioTypeFilterValue,
} from "../components/scenario-type-filter";
import { isFaction, normalizeScenarioText } from "../lib/scenario-formatters";
import type { ScenarioEntity } from "../types/scenario";

type ScenarioCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function ScenarioCatalogView({
  category,
  onCategoryChange,
}: ScenarioCatalogViewProps) {
  const [entities, setEntities] = useState<ScenarioEntity[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ScenarioTypeFilterValue>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityUid, setSelectedEntityUid] = useState<string | null>(
    null,
  );
  const [sidebarResetVersion, setSidebarResetVersion] = useState(0);

  useEffect(() => {
    async function loadScenarioEntities() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicScenarioEntities();
        setEntities(data);
      } catch {
        setError(SCENARIO_CATALOG_CONFIG.copy.main.errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void loadScenarioEntities();
  }, []);

  const selectedEntity = useMemo(() => {
    if (!selectedEntityUid) {
      return null;
    }

    return entities.find((entity) => entity.uid === selectedEntityUid) ?? null;
  }, [entities, selectedEntityUid]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedEntityUid(null);
  }

  function handleTypeFilterChange(value: ScenarioTypeFilterValue) {
    setTypeFilter(value);
    setSelectedEntityUid(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectEntity(uid: string) {
    setSelectedEntityUid(uid);
    setSearch("");
    setTypeFilter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleResetFilters() {
    setSearch("");
    setTypeFilter(null);
    setSelectedEntityUid(null);
    setSidebarResetVersion((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredEntities = useMemo(() => {
    const query = normalizeScenarioText(search);

    return entities.filter((entity) => {
      const matchesType = !typeFilter || entity.type === typeFilter;

      const searchableText = [
        entity.name,
        entity.tagline ?? "",
        entity.description ?? "",
        isFaction(entity) ? (entity.subtype ?? "") : "",
        isFaction(entity)
          ? entity.location_relations
              .map(
                (relation) =>
                  `${relation.location_name} ${relation.relation_type}`,
              )
              .join(" ")
          : "",
      ].join(" ");

      const matchesSearch =
        !query || normalizeScenarioText(searchableText).includes(query);

      return matchesType && matchesSearch;
    });
  }, [entities, search, typeFilter]);

  const locationCount = useMemo(() => {
    return entities.filter((entity) => entity.type === "location").length;
  }, [entities]);

  const factionCount = useMemo(() => {
    return entities.filter((entity) => entity.type === "faction").length;
  }, [entities]);

  return (
    <CatalogLayout
      sidebarHeaderTitle={SCENARIO_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={
        SCENARIO_CATALOG_CONFIG.layout.sidebarHeaderSubtitle
      }
      searchPlaceholder={SCENARIO_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div className={pageStyles.filterBlock}>
          <ScenarioTypeFilter
            value={typeFilter}
            onChange={handleTypeFilterChange}
          />

          <button
            type="button"
            onClick={handleResetFilters}
            className={pageStyles.resetButton}
          >
            {SCENARIO_CATALOG_CONFIG.copy.sidebar.resetFiltersLabel}
          </button>
        </div>
      }
      sidebarContent={
        loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            <div className={pageStyles.summary}>
              <span>{locationCount} locais</span>
              <span>{factionCount} facções</span>
            </div>

            <ScenarioSidebar
              key={sidebarResetVersion}
              entities={entities}
              selectedEntityUid={selectedEntityUid}
              onSelectEntity={handleSelectEntity}
            />
          </>
        )
      }
      mainContent={
        loading ? (
          <LoadingState
            message={SCENARIO_CATALOG_CONFIG.copy.main.loadingMessage}
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : selectedEntity ? (
          <ScenarioDetailPanel entity={selectedEntity} entities={entities} />
        ) : (
          <ScenarioCardsPanel entities={filteredEntities} />
        )
      }
    />
  );
}
