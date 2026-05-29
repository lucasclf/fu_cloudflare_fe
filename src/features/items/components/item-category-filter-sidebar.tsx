import { CatalogFilterButton } from "@/features/catalog/components/catalog-filter-button";
import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import type { ItemType } from "../types/item";

import "./item-category-filter-sidebar.css";

type ItemCategoryFilterSidebarProps = {
  selectedType: ItemType | null;
  typeCounts: Partial<Record<ItemType, number>>;
  totalCount: number;
  onSelectType: (itemType: ItemType | null) => void;
};

export function ItemCategoryFilterSidebar({
  selectedType,
  typeCounts,
  totalCount,
  onSelectType,
}: ItemCategoryFilterSidebarProps) {
  return (
    <nav
      className="item-category-filter-sidebar"
      aria-label="Filtros por tipo de item"
    >
      <CatalogFilterButton
        label="Todas"
        count={String(totalCount)}
        isActive={selectedType === null}
        onClick={() => onSelectType(null)}
      />

      {ITEMS_CATALOG_CONFIG.types.options.map((itemType) => (
        <CatalogFilterButton
          key={itemType}
          label={ITEMS_CATALOG_CONFIG.types.labels[itemType]}
          count={String(typeCounts[itemType] ?? 0)}
          isActive={selectedType === itemType}
          onClick={() => onSelectType(itemType)}
        />
      ))}
    </nav>
  );
}
