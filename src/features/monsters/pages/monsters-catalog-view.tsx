import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicMonsterById } from "../api/get-public-monster-by-id";
import { getPublicMonsterSummary } from "../api/get-public-monster-summary";
import { MonsterCardsPanel } from "../components/monster-cards-panel";
import { MonsterDetailPanel } from "../components/monster-detail-panel";
import { MonsterLevelFilter } from "../components/monster-level-filter";
import { MonsterTypeFilter } from "../components/monster-type-filter";
import {
  getMonsterTypeCounts,
  isMonsterVillain,
  normalizeMonsterText,
} from "../lib/monster-formatters";
import type { MonsterDetail, MonsterSummary } from "../types/monster";

type MonstersCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function MonstersCatalogView({
  category,
  onCategoryChange,
}: MonstersCatalogViewProps) {
  const [monsters, setMonsters] = useState<MonsterSummary[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [search, setSearch] = useState("");
  const [villainOnly, setVillainOnly] = useState(false);
  const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(
    null,
  );
  const [selectedMonster, setSelectedMonster] = useState<MonsterDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMonsters() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicMonsterSummary();
        setMonsters(data);
      } catch {
        setError("Não foi possível carregar o bestiário.");
      } finally {
        setLoading(false);
      }
    }

    void loadMonsters();
  }, []);

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

  async function handleSelectMonster(monsterId: number) {
    try {
      setSelectedMonsterId(monsterId);
      setDetailLoading(true);
      setDetailError(null);

      const monster = await getPublicMonsterById(monsterId);
      setSelectedMonster(monster);
    } catch {
      setDetailError("Não foi possível carregar os detalhes do monstro.");
      setSelectedMonster(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function handleBackToList() {
    setSelectedMonsterId(null);
    setSelectedMonster(null);
    setDetailError(null);
  }

  function handleResetFilters() {
    setSearch("");
    setSelectedType(null);
    setMinLevel("");
    setMaxLevel("");
    setVillainOnly(false);
    handleBackToList();
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedType(null);
    setMinLevel("");
    setMaxLevel("");
    setVillainOnly(false);
    handleBackToList();
  }

  function handleSelectType(type: string | null) {
    setSelectedType(type);
    setSearch("");
    handleBackToList();
  }

  function handleMinLevelChange(value: string) {
    setMinLevel(value);
    setSearch("");
    handleBackToList();
  }

  function handleMaxLevelChange(value: string) {
    setMaxLevel(value);
    setSearch("");
    handleBackToList();
  }

  function handleToggleVillainOnly() {
    setVillainOnly((current) => !current);
    setSearch("");
    handleBackToList();
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="Bestiário"
      sidebarHeaderSubtitle="Criaturas e ameaças"
      searchPlaceholder="Buscar monstro..."
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div style={styles.filterBlock}>
          <MonsterLevelFilter
            minLevel={minLevel}
            maxLevel={maxLevel}
            onMinLevelChange={handleMinLevelChange}
            onMaxLevelChange={handleMaxLevelChange}
          />

          <button
            type="button"
            aria-pressed={villainOnly}
            onClick={handleToggleVillainOnly}
            style={{
              ...styles.villainFilterButton,
              ...(villainOnly ? styles.villainFilterButtonActive : {}),
            }}
          >
            Vilões
          </button>

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
          <MonsterTypeFilter
            typeCounts={typeCounts}
            selectedType={selectedType}
            totalCount={monsters.length}
            onSelectType={handleSelectType}
          />
        )
      }
      mainContent={
        loading ? (
          <div>Carregando bestiário...</div>
        ) : error ? (
          <div>{error}</div>
        ) : detailLoading ? (
          <div>Carregando monstro...</div>
        ) : detailError ? (
          <div>{detailError}</div>
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

const styles: Record<string, CSSProperties> = {
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

  villainFilterButton: {
    width: "100%",
    border: "1px solid #4c2422",
    borderRadius: "8px",
    background: "#160d0c",
    color: "#b46b64",
    padding: "9px 10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "center",
  },

  villainFilterButtonActive: {
    background: "#2a1210",
    color: "#ffb3a8",
    borderColor: "#b94a3f",
    boxShadow: "0 0 0 1px rgba(185, 74, 63, 0.24)",
  },
};