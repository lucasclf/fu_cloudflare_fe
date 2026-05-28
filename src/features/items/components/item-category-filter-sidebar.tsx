import { SidebarOptionButton } from "@/shared/components/sidebar-option-button";
import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import type { ItemType } from "../types/item";

import "./item-category-filter-sidebar.css";

type ItemCategoryFilterSidebarProps = {
  selectedType: ItemType | null;
  onSelectType: (itemType: ItemType | null) => void;
};

export function ItemCategoryFilterSidebar({
  selectedType,
  onSelectType,
}: ItemCategoryFilterSidebarProps) {
  return (
    <nav
      className="item-category-filter-sidebar"
      aria-label="Filtros por tipo de item"
    >
      <SidebarOptionButton
        isActive={selectedType === null}
        onClick={() => onSelectType(null)}
      >
        Todas
      </SidebarOptionButton>

      {ITEMS_CATALOG_CONFIG.types.options.map((itemType) => {
        const isActive = selectedType === itemType;

        return (
          <SidebarOptionButton
            key={itemType}
            isActive={isActive}
            onClick={() => onSelectType(itemType)}
          >
            {ITEMS_CATALOG_CONFIG.types.labels[itemType]}
          </SidebarOptionButton>
        );
      })}
    </nav>
  );
}
