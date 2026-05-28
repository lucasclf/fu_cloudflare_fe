import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import type { Item, ItemType } from "../types/item";

export type ItemsGroupedByType = Record<ItemType, Item[]>;

export function groupItemsByType(items: readonly Item[]): ItemsGroupedByType {
  const groupedItems = createEmptyItemsGroupedByType();

  items.forEach((item) => {
    groupedItems[item.itemType].push(item);
  });

  return groupedItems;
}

function createEmptyItemsGroupedByType(): ItemsGroupedByType {
  return ITEMS_CATALOG_CONFIG.types.options.reduce((groupedItems, itemType) => {
    groupedItems[itemType] = [];

    return groupedItems;
  }, {} as ItemsGroupedByType);
}
