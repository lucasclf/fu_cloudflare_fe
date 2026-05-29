import { CatalogFilterButton } from "../../catalog/components/catalog-filter-button";
import styles from "./power-type-filter.module.css";

export type PowerTypeFilterValue = "common" | "heroic" | null;

type PowerTypeFilterProps = {
  value: PowerTypeFilterValue;
  onChange: (value: PowerTypeFilterValue) => void;
};

const FILTERS: Array<{
  value: Exclude<PowerTypeFilterValue, null>;
  label: string;
}> = [
  { value: "common", label: "Comum" },
  { value: "heroic", label: "Heróico" },
];

export function PowerTypeFilter({ value, onChange }: PowerTypeFilterProps) {
  return (
    <div className={styles.wrapper} aria-label="Filtro por tipo de poder">
      {FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <CatalogFilterButton
            key={filter.value}
            label={filter.label}
            isActive={active}
            onClick={() => onChange(active ? null : filter.value)}
          />
        );
      })}
    </div>
  );
}
