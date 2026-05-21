import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicPowers } from "../api/get-public-powers";
import { PowerCardsPanel } from "../components/power-cards-panel";
import {
  PowerTypeFilter,
  type PowerTypeFilterValue,
} from "../components/power-type-filter";
import {
  getPowerJobNames,
  isPowerUnrestricted,
  normalizePowerText,
} from "../lib/power-formatters";
import type { Power } from "../types/power";

type PowersCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

const ALL_CLASSES_FILTER = "__ALL_CLASSES__";
const UNRESTRICTED_CLASS_FILTER = "__UNRESTRICTED_CLASS__";

type ClassFilterValue = typeof ALL_CLASSES_FILTER | typeof UNRESTRICTED_CLASS_FILTER | string;

export function PowersCatalogView({
  category,
  onCategoryChange,
}: PowersCatalogViewProps) {
  const [powers, setPowers] = useState<Power[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] =
    useState<ClassFilterValue>(ALL_CLASSES_FILTER);
  const [typeFilter, setTypeFilter] = useState<PowerTypeFilterValue>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPowers() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicPowers();
        setPowers(data);
      } catch {
        setError("Não foi possível carregar os poderes.");
      } finally {
        setLoading(false);
      }
    }

    void loadPowers();
  }, []);

  const classPowerCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const power of powers) {
      const jobNames = getPowerJobNames(power);

      for (const jobName of jobNames) {
        const normalizedJobName = jobName.trim();

        if (!normalizedJobName) {
          continue;
        }

        counts.set(normalizedJobName, (counts.get(normalizedJobName) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([jobName, count]) => ({
        jobName,
        count,
      }))
      .sort((a, b) => a.jobName.localeCompare(b.jobName));
  }, [powers]);

  const unrestrictedPowerCount = useMemo(() => {
    return powers.filter((power) => isPowerUnrestricted(power)).length;
  }, [powers]);

  const filteredPowers = useMemo(() => {
    const query = normalizePowerText(search);

    return powers.filter((power) => {
      const jobNames = getPowerJobNames(power);

      const matchesSearch =
        !query ||
        normalizePowerText(power.name).includes(query) ||
        normalizePowerText(power.description).includes(query);

      const matchesClass =
        selectedClassFilter === ALL_CLASSES_FILTER ||
        (selectedClassFilter === UNRESTRICTED_CLASS_FILTER &&
          isPowerUnrestricted(power)) ||
        jobNames.includes(selectedClassFilter);

      const matchesType =
        typeFilter === null || power.type === typeFilter;

      return matchesSearch && matchesClass && matchesType;
    });
  }, [powers, search, selectedClassFilter, typeFilter]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedClassFilter(ALL_CLASSES_FILTER);
  }

  function handleSelectClassFilter(value: ClassFilterValue) {
    setSelectedClassFilter(value);
    setSearch("");
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="Filtros de poder"
      sidebarHeaderSubtitle="Poderes por classe"
      searchPlaceholder="Buscar poder..."
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <PowerTypeFilter value={typeFilter} onChange={setTypeFilter} />
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
              onClick={() => handleSelectClassFilter(ALL_CLASSES_FILTER)}
              style={{
                ...styles.classFilterButton,
                ...(selectedClassFilter === ALL_CLASSES_FILTER
                  ? styles.classFilterButtonActive
                  : {}),
              }}
            >
              <span>Todas as classes</span>
              <span style={styles.classFilterCount}>
                {formatPowerCount(powers.length)}
              </span>
            </button>

            {classPowerCounts.map(({ jobName, count }) => (
              <button
                key={jobName}
                type="button"
                onClick={() => handleSelectClassFilter(jobName)}
                style={{
                  ...styles.classFilterButton,
                  ...(selectedClassFilter === jobName
                    ? styles.classFilterButtonActive
                    : {}),
                }}
              >
                <span>{jobName}</span>
                <span style={styles.classFilterCount}>
                  {formatPowerCount(count)}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                handleSelectClassFilter(UNRESTRICTED_CLASS_FILTER)
              }
              style={{
                ...styles.classFilterButton,
                ...(selectedClassFilter === UNRESTRICTED_CLASS_FILTER
                  ? styles.classFilterButtonActive
                  : {}),
              }}
            >
              <span>Sem restrição de classe</span>
              <span style={styles.classFilterCount}>
                {formatPowerCount(unrestrictedPowerCount)}
              </span>
            </button>

            <div style={styles.sidebarSummary}>
              Exibindo {filteredPowers.length} de {powers.length} poderes.
            </div>
          </div>
        )
      }
      mainContent={
        loading ? (
          <div>Carregando poderes...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <PowerCardsPanel powers={filteredPowers} />
        )
      }
    />
  );
}

function formatPowerCount(count: number): string {
  return `${count} ${count === 1 ? "poder" : "poderes"}`;
}

const styles: Record<string, CSSProperties> = {
  sidebarContent: {
    padding: "12px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  classFilterButton: {
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

  classFilterButtonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },

  classFilterCount: {
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