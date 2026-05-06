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
    const min = minLevel.trim() === "" ? null : Number(minLevel);
    const max = maxLevel.trim() === "" ? null : Number(maxLevel);

    return monsters.filter((monster) => {
      const matchesType =
        selectedType === null || monster.monster_type === selectedType;

      const matchesMin =
        min === null || !Number.isFinite(min) || monster.level >= min;

      const matchesMax =
        max === null || !Number.isFinite(max) || monster.level <= max;

      return matchesType && matchesMin && matchesMax;
    });
  }, [monsters, selectedType, minLevel, maxLevel]);

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
    setSelectedType(null);
    setMinLevel("");
    setMaxLevel("");
    handleBackToList();
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="Bestiário"
      sidebarHeaderSubtitle="Criaturas e ameaças"
      searchPlaceholder="Buscar monstro..."
      searchValue=""
      onSearchChange={() => undefined}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <div style={styles.filterBlock}>
          <MonsterLevelFilter
            minLevel={minLevel}
            maxLevel={maxLevel}
            onMinLevelChange={(value) => {
              setMinLevel(value);
              handleBackToList();
            }}
            onMaxLevelChange={(value) => {
              setMaxLevel(value);
              handleBackToList();
            }}
          />

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
            onSelectType={(type) => {
              setSelectedType(type);
              handleBackToList();
            }}
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
};