import { SidebarOptionButton } from "../../../shared/components/sidebar-option-button";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "../config/item-type-config";
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

      {ITEM_TYPE_OPTIONS.map((itemType) => {
        const isActive = selectedType === itemType;

        return (
          <SidebarOptionButton
            key={itemType}
            isActive={isActive}
            onClick={() => onSelectType(itemType)}
          >
            {ITEM_TYPE_LABELS[itemType]}
          </SidebarOptionButton>
        );
      })}
    </nav>
  );
}