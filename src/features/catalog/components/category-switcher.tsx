import { SelectField } from "../../../shared/components/select-field";
import type { CatalogCategory } from "../types/category";
import { CATALOG_CATEGORY_OPTIONS } from "../types/category";

type CategorySwitcherProps = {
  value: CatalogCategory;
  onChange: (value: CatalogCategory) => void;
};

export function CategorySwitcher({ value, onChange }: CategorySwitcherProps) {
  return (
    <SelectField
      id="catalog-category"
      label="Categoria"
      value={value}
      options={CATALOG_CATEGORY_OPTIONS}
      onChange={onChange}
    />
  );
}
