import { ITEM_TYPE_OPTIONS } from "../config/item-type-config";
import type { ItemsGroupedByType } from "./group-items-by-type";
import type { ItemType } from "../types/item";

type GetVisibleItemTypesParams = {
  groupedItems: ItemsGroupedByType;
  selectedType: ItemType | null;
};

export function getVisibleItemTypes({
  groupedItems,
  selectedType,
}: GetVisibleItemTypesParams): ItemType[] {
  if (selectedType !== null) {
    return groupedItems[selectedType].length > 0 ? [selectedType] : [];
  }

  return ITEM_TYPE_OPTIONS.filter(
    (itemType) => groupedItems[itemType].length > 0,
  );
}