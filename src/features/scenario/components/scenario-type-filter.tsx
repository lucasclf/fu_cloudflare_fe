import panelStyles from "./scenario-type-filter.module.css";
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
    <div className={panelStyles.wrapper} aria-label="Filtro por tipo de entidade">
      {FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? null : filter.value)}
            className={[panelStyles.button, active && panelStyles.buttonActive]
              .filter(Boolean)
              .join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
