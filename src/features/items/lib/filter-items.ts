import type { Item, ItemType } from "../types/item";

export type FilterItemsParams = {
  items: readonly Item[];
  search: string;
  selectedType: ItemType | null;
};

export function filterItems({
  items,
  search,
  selectedType,
}: FilterItemsParams): Item[] {
  const normalizedSearch = normalizeSearchText(search);

  return items.filter((item) => {
    const matchesType =
      selectedType === null || item.item_type === selectedType;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      normalizeSearchText(item.name).includes(normalizedSearch);

    return matchesType && matchesSearch;
  });
}

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}