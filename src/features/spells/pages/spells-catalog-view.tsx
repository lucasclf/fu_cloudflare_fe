import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicSpells } from "../api/get-public-spells";
import { SpellCardsPanel } from "../components/spell-cards-panel";
import { SpellOffensiveToggle } from "../components/spell-offensive-toggle";
import {
  getSpellSourceName,
  isJobSpell,
  isMonsterSpell,
  isSpellOffensive,
  normalizeSpellText,
} from "../lib/spell-formatters";
import type { Spell } from "../types/spell";

type SpellSourceFilter =
  | { type: "all" }
  | { type: "job"; jobName: string }
  | { type: "monster" };

type SpellsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function SpellsCatalogView({
  category,
  onCategoryChange,
}: SpellsCatalogViewProps) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [search, setSearch] = useState("");
  const [offensiveOnly, setOffensiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<SpellSourceFilter>({
    type: "all",
  });

  useEffect(() => {
    async function loadSpells() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicSpells();
        setSpells(data);
      } catch {
        setError("Não foi possível carregar as magias.");
      } finally {
        setLoading(false);
      }
    }

    void loadSpells();
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSourceFilter({ type: "all" });
  }

  function handleSelectAllSources() {
    setSourceFilter({ type: "all" });
    setSearch("");
  }

  function handleSelectMonsterSource() {
    setSourceFilter({ type: "monster" });
    setSearch("");
  }

  function handleSelectJobSource(jobName: string) {
    setSourceFilter({ type: "job", jobName });
    setSearch("");
  }

  const monsterSpellCount = useMemo(() => {
    return spells.filter((spell) => spell.nature === "monster").length;
  }, [spells]);

  const jobSpellCounts = useMemo(() => {
  const counts = new Map<string, number>();

  for (const spell of spells) {
    if (!isJobSpell(spell)) {
      continue;
    }

    const jobName = spell.job_name?.trim();

    if (!jobName) {
      continue;
    }

    counts.set(jobName, (counts.get(jobName) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([jobName, count]) => ({
      jobName,
      count,
    }))
      .sort((a, b) => a.jobName.localeCompare(b.jobName));
  }, [spells]);

const filteredSpells = useMemo(() => {
  const query = normalizeSpellText(search);

  return spells.filter((spell) => {
    const sourceName = getSpellSourceName(spell);

    const matchesSearch =
      !query || normalizeSpellText(sourceName).includes(query);

    const matchesSource =
      sourceFilter.type === "all" ||
      (sourceFilter.type === "monster" && isMonsterSpell(spell)) ||
      (sourceFilter.type === "job" &&
        isJobSpell(spell) &&
        spell.job_name?.trim() === sourceFilter.jobName);

    const matchesOffensive =
      !offensiveOnly || isSpellOffensive(spell.is_offensive);

    return matchesSearch && matchesSource && matchesOffensive;
  });
}, [spells, search, sourceFilter, offensiveOnly]);

  return (
    <CatalogLayout
      sidebarHeaderTitle="Filtros de magia"
      sidebarHeaderSubtitle="Magias por classe"
      searchPlaceholder="Filtrar por classe..."
      searchValue={search}
      onSearchChange={handleSearchChange}
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
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : error ? (
          <div style={{ padding: "16px" }}>{error}</div>
        ) : (
          <div style={styles.sidebarContent}>
            <button
              type="button"
              onClick={handleSelectAllSources}
              style={{
                ...styles.jobFilterButton,
                ...(sourceFilter.type === "all" ? styles.jobFilterButtonActive : {}),
              }}
            >
              <span>Todas as origens</span>
              <span style={styles.jobFilterCount}>
                {formatSpellCount(spells.length)}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSelectMonsterSource}
              style={{
                ...styles.jobFilterButton,
                ...(sourceFilter.type === "monster"
                  ? styles.jobFilterButtonActive
                  : {}),
              }}
            >
              <span>Monstros</span>
              <span style={styles.jobFilterCount}>
                {formatSpellCount(monsterSpellCount)}
              </span>
            </button> 

            {jobSpellCounts.map(({ jobName, count }) => (
              <button
                key={jobName}
                type="button"
                onClick={() => handleSelectJobSource(jobName)}
                style={{
                  ...styles.jobFilterButton,
                  ...(sourceFilter.type === "job" && sourceFilter.jobName === jobName
                    ? styles.jobFilterButtonActive
                    : {}),
                }}
              >
                <span>{jobName}</span>
                <span style={styles.jobFilterCount}>
                  {formatSpellCount(count)}
                </span>
              </button>
            ))}

            <div style={styles.sidebarSummary}>
              Exibindo {filteredSpells.length} de {spells.length} magias.
            </div>
          </div>
        )
      }
      mainContent={
        loading ? (
          <div>Carregando magias...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <SpellCardsPanel spells={filteredSpells} />
        )
      }
    />
  );
}

const styles: Record<string, CSSProperties> = {
  sidebarContent: {
    padding: "12px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  jobFilterButton: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    color: "#7a6e5a",
    padding: "9px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
  },

  jobFilterButtonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },

  jobFilterCount: {
    color: "#9f8f73",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  sidebarSummary: {
    marginTop: "8px",
    color: "#7a6e5a",
    fontSize: "13px",
    lineHeight: 1.4,
  },
};

function formatSpellCount(count: number): string {
  return `${count} ${count === 1 ? "magia" : "magias"}`;
}