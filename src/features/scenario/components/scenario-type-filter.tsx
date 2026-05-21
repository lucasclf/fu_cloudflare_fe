import type { CSSProperties } from "react";
import type { ScenarioEntityType } from "../types/scenario";

export type ScenarioTypeFilterValue = ScenarioEntityType | null;

type Props = {
  value: ScenarioTypeFilterValue;
  onChange: (value: ScenarioTypeFilterValue) => void;
};

const FILTERS: Array<{
  value: ScenarioEntityType;
  label: string;
}> = [
  {
    value: "location",
    label: "Locais",
  },
  {
    value: "faction",
    label: "Facções",
  },
];

export function ScenarioTypeFilter({ value, onChange }: Props) {
  return (
    <div style={styles.wrapper} aria-label="Filtro por tipo de entidade">
      {FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? null : filter.value)}
            style={{
              ...styles.button,
              ...(active ? styles.buttonActive : {}),
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  button: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    color: "#7a6e5a",
    padding: "9px 10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "center",
  },

  buttonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },
};