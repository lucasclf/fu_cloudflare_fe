import { CatalogFilterButton } from "../../catalog/components/catalog-filter-button";
import styles from "./monster-type-filter.module.css";

type MonsterTypeCount = {
  type: string;
  label: string;
  count: number;
};

type MonsterTypeFilterProps = {
  typeCounts: MonsterTypeCount[];
  selectedType: string | null;
  totalCount: number;
  onSelectType: (type: string | null) => void;
};

export function MonsterTypeFilter({
  typeCounts,
  selectedType,
  totalCount,
  onSelectType,
}: MonsterTypeFilterProps) {
  return (
    <div className={styles.wrapper}>
      <CatalogFilterButton
        label="Todos os tipos"
        count={String(totalCount)}
        isActive={selectedType === null}
        onClick={() => onSelectType(null)}
      />

      {typeCounts.map(({ type, label, count }) => (
        <CatalogFilterButton
          key={type}
          label={label}
          count={String(count)}
          isActive={selectedType === type}
          onClick={() => onSelectType(type)}
        />
      ))}
    </div>
  );
}
