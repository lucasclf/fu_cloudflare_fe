import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { usePublicScenarioEntities } from "@/features/scenario/hooks/use-public-scenario-entities";
import { SCENARIO_CATALOG_CONFIG } from "@/features/scenario/config/scenario-catalog-config";
import { ScenarioCardsPanel } from "@/features/scenario/components/scenario-cards-panel";
import { ScenarioSidebar } from "@/features/scenario/components/scenario-sidebar";
import { ScenarioDetailPanel } from "@/features/scenario/components/scenario-detail-panel";
import {
  ScenarioTypeFilter,
  type ScenarioTypeFilterValue,
} from "@/features/scenario/components/scenario-type-filter";
import { isFaction, normalizeScenarioText } from "@/features/scenario/lib/scenario-formatters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignScenarioEntities } from "../hooks/use-campaign-scenario-entities";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

import pageStyles from "@/features/scenario/pages/scenario-catalog-view.module.css";

type CampaignScenarioCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignScenarioCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignScenarioCatalogViewProps) {
  const global = usePublicScenarioEntities();
  const campaign = useCampaignScenarioEntities(campaignId);
  const { data: entities, loading, error } = useCombinedCatalog(global, campaign);
  const entitiesList = useMemo(() => entities ?? [], [entities]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ScenarioTypeFilterValue>(null);
  const [selectedEntityUid, setSelectedEntityUid] = useState<string | null>(
    null,
  );
  const [sidebarResetVersion, setSidebarResetVersion] = useState(0);

  const selectedEntity = useMemo(() => {
    if (!selectedEntityUid) {
      return null;
    }

    return entitiesList.find((entity) => entity.uid === selectedEntityUid) ?? null;
  }, [entitiesList, selectedEntityUid]);

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

    return entitiesList.filter((entity) => {
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
  }, [entitiesList, search, typeFilter]);

  const locationCount = useMemo(() => {
    return entitiesList.filter((entity) => entity.type === "location").length;
  }, [entitiesList]);

  const factionCount = useMemo(() => {
    return entitiesList.filter((entity) => entity.type === "faction").length;
  }, [entitiesList]);

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
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
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
              entities={entitiesList}
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
          <ScenarioDetailPanel entity={selectedEntity} entities={entitiesList} />
        ) : (
          <ScenarioCardsPanel entities={filteredEntities} />
        )
      }
    />
  );
}
