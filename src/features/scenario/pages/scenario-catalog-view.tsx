import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicScenarioEntities } from "../api/get-public-scenario-entities";
import { ScenarioCardsPanel } from "../components/scenario-cards-panel";
import { ScenarioSidebar } from "../components/scenario-sidebar";
import { ScenarioDetailPanel } from "../components/scenario-detail-panel";
import {
  ScenarioTypeFilter,
  type ScenarioTypeFilterValue,
} from "../components/scenario-type-filter";
import {
  isFaction,
  normalizeScenarioText,
} from "../lib/scenario-formatters";
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
  const [selectedEntityUid, setSelectedEntityUid] = useState<string | null>(null);
  const [sidebarResetVersion, setSidebarResetVersion] = useState(0);

  useEffect(() => {
    async function loadScenarioEntities() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicScenarioEntities();
        setEntities(data);
      } catch {
        setError("Não foi possível carregar o cenário.");
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
  }

  function handleSelectEntity(uid: string) {
    setSelectedEntityUid(uid);
    setSearch("");
    setTypeFilter(null);
  }

  function handleResetFilters() {
    setSearch("");
    setTypeFilter(null);
    setSelectedEntityUid(null);
    setSidebarResetVersion((current) => current + 1);
  }

  const filteredEntities = useMemo(() => {
    const query = normalizeScenarioText(search);

    return entities.filter((entity) => {
      const matchesType = !typeFilter || entity.type === typeFilter;

      const searchableText = [
        entity.name,
        entity.tagline ?? "",
        entity.description ?? "",
        isFaction(entity) ? entity.subtype ?? "" : "",
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
      sidebarHeaderTitle="Cenário"
      sidebarHeaderSubtitle="Locais e facções"
      searchPlaceholder="Buscar cenário..."
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div style={styles.filterBlock}>
          <ScenarioTypeFilter value={typeFilter} onChange={handleTypeFilterChange} />

          <button
            type="button"
            onClick={handleResetFilters}
            style={styles.resetButton}
          >
            Mostrar todos
          </button>
        </div>
      }
      sidebarContent={
        loading ? (
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : error ? (
          <div style={{ padding: "16px" }}>{error}</div>
        ) : (
          <>
            <div style={styles.summary}>
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
          <div>Carregando cenário...</div>
        ) : error ? (
          <div>{error}</div>
        ) : selectedEntity ? (
          <ScenarioDetailPanel entity={selectedEntity} entities={entities} />
        ) : (
          <ScenarioCardsPanel entities={filteredEntities} />
        )
      }
    />
  );
}

const styles: Record<string, CSSProperties> = {
  summary: {
    padding: "0 16px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#7a6e5a",
    fontSize: "12px",
    fontWeight: 700,
  },

  filterBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  resetButton: {
    width: "100%",
    border: "1px solid #4c3922",
    borderRadius: "8px",
    background: "#15110f",
    color: "#c9963a",
    padding: "9px 10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "center",
  },
};