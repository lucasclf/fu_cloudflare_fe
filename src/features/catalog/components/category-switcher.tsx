import { SelectField } from "../../../shared/components/select-field";

import type { CatalogCategory } from "../types/category";
import { CATEGORY_LABELS } from "../types/category";

type CategorySwitcherProps = {
  value: CatalogCategory;
  onChange: (value: CatalogCategory) => void;
};

const AVAILABLE_CATEGORIES: CatalogCategory[] = [
  "sessions",
  "items",
  "characters",
  "npcs",
  "bestiary",
  "spells",
  "powers",
  "classes",
  "scenario",
];

const CATEGORY_OPTIONS = AVAILABLE_CATEGORIES.map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}));

export function CategorySwitcher({ value, onChange }: CategorySwitcherProps) {
  return (
    <SelectField
      id="catalog-category"
      label="Categoria"
      value={value}
      options={CATEGORY_OPTIONS}
      onChange={onChange}
    />
  );
}
