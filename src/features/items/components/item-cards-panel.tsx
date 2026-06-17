import { useMemo } from "react";

import { EmptyState } from "@/shared/components/empty-state";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import { useExpandedItemTypes } from "../hooks/use-expanded-item-types";
import { getVisibleItemTypes } from "../lib/get-visible-item-types";
import { groupItemsByType } from "../lib/group-items-by-type";
import type { Item, ItemType } from "../types/item";
import { ItemTypeSection } from "./item-type-section";

import "./item-cards-panel.css";

type ItemCardsPanelProps = {
  items: Item[];
  selectedType: ItemType | null;
  onEditItem?: (item: Item) => void;
  editableItemIds?: Set<number>;
};

export function ItemCardsPanel({ items, selectedType, onEditItem, editableItemIds }: ItemCardsPanelProps) {
  const { isItemTypeExpanded, toggleItemType } =
    useExpandedItemTypes(selectedType);

  const groupedItems = useMemo(() => {
    return groupItemsByType(items);
  }, [items]);

  const visibleTypes = useMemo(() => {
    return getVisibleItemTypes({
      groupedItems,
      selectedType,
    });
  }, [groupedItems, selectedType]);

  if (visibleTypes.length === 0) {
    return (
      <EmptyState
        title={ITEMS_CATALOG_COPY.groupsEmptyState.title}
        description={ITEMS_CATALOG_COPY.groupsEmptyState.description}
      />
    );
  }

  return (
    <div className="item-cards-panel">
      {visibleTypes.map((itemType) => {
        const typeItems = groupedItems[itemType];

        return (
          <ItemTypeSection
            key={itemType}
            itemType={itemType}
            items={typeItems}
            isExpanded={isItemTypeExpanded(itemType)}
            onToggle={toggleItemType}
            onEditItem={onEditItem}
            editableItemIds={editableItemIds}
          />
        );
      })}
    </div>
  );
}
