import type { CatalogCategory } from "../types/category";
import { CATEGORY_LABELS } from "../types/category";

type Props = {
  value: CatalogCategory;
  onChange: (value: CatalogCategory) => void;
};

const AVAILABLE_CATEGORIES: CatalogCategory[] = [
  "sessions",
  "items",
  "characters",
  "npcs",
  "bestiary",
  "villains",
  "spells",
  "powers",
  "classes",
  "scenario",
];

export function CategorySwitcher({ value, onChange }: Props) {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Categoria</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CatalogCategory)}
        style={styles.select}
      >
        {AVAILABLE_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {CATEGORY_LABELS[category]}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#7a6e5a",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  select: {
    background: "#1e1a16",
    border: "1px solid #3a2e22",
    color: "#d4c9b0",
    padding: "8px 10px",
    borderRadius: "4px",
  },
};