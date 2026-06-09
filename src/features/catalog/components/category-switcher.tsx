import { SelectField } from "../../../shared/components/select-field";

import type { CatalogCategory } from "../types/category";
import { CATEGORY_LABELS } from "../types/category";
import { useAllowedCategories } from "../hooks/use-allowed-categories";

type CategorySwitcherProps = {
  value: CatalogCategory;
  onChange: (value: CatalogCategory) => void;
};

export function CategorySwitcher({ value, onChange }: CategorySwitcherProps) {
  const allowedCategories = useAllowedCategories();
  const options = allowedCategories.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  }));

  return (
    <SelectField
      id="catalog-category"
      label="Categoria"
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
