import { ITEM_TYPE_OPTIONS } from "../config/item-type-config";
import type { Item, ItemType } from "../types/item";

export type ItemsGroupedByType = Record<ItemType, Item[]>;

export function groupItemsByType(items: readonly Item[]): ItemsGroupedByType {
  const groupedItems = createEmptyItemsGroupedByType();

  items.forEach((item) => {
    groupedItems[item.item_type].push(item);
  });

  return groupedItems;
}

function createEmptyItemsGroupedByType(): ItemsGroupedByType {
  return ITEM_TYPE_OPTIONS.reduce((groupedItems, itemType) => {
    groupedItems[itemType] = [];

    return groupedItems;
  }, {} as ItemsGroupedByType);
}