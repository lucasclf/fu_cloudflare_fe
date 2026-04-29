import type { CSSProperties } from "react";
import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
  type JobFeatureFilterKey,
} from "./job-allowance-icons";

type Props = {
  selectedFeatureKeys: JobFeatureFilterKey[];
  onToggleFeatureKey: (key: JobFeatureFilterKey) => void;
};

export function JobAllowanceFilterBar({
  selectedFeatureKeys,
  onToggleFeatureKey,
}: Props) {
  return (
    <div style={styles.wrapper} aria-label="Filtros de características da classe">
      {ALLOWANCE_DEFINITIONS.map(({ key, label, icon }) => {
        const isActive = selectedFeatureKeys.includes(key);

        return (
          <button
            key={key}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onToggleFeatureKey(key)}
            style={{
              ...styles.filterButton,
              ...(isActive ? styles.filterButtonActive : {}),
            }}
          >
            {icon}
          </button>
        );
      })}

      {BONUS_DEFINITIONS.map(({ key, label, icon }) => {
        const isActive = selectedFeatureKeys.includes(key);

        return (
          <button
            key={key}
            type="button"
            title={`Classes com ${label}`}
            aria-label={`Classes com ${label}`}
            aria-pressed={isActive}
            onClick={() => onToggleFeatureKey(key)}
            style={{
              ...styles.filterButton,
              ...(isActive ? styles.filterButtonActive : {}),
            }}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "10px",
  },
  filterButton: {
    width: "29px",
    height: "29px",
    padding: 0,
    borderRadius: "999px",
    border: "1px solid #34291f",
    background: "#110e0c",
    color: "#5f574c",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition:
      "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
  },
  filterButtonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },
};
