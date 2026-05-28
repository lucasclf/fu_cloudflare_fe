import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
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

  return ITEMS_CATALOG_CONFIG.types.options.filter(
    (itemType) => groupedItems[itemType].length > 0,
  );
}  