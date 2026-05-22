import { useCallback, useMemo, useState } from "react";

import { filterItems } from "../lib/filter-items";
import type { Item, ItemType } from "../types/item";

type UseItemsCatalogFiltersParams = {
  items: readonly Item[];
};

type UseItemsCatalogFiltersResult = {
  search: string;
  selectedType: ItemType | null;
  filteredItems: Item[];
  hasActiveFilters: boolean;
  setSearch: (search: string) => void;
  setSelectedType: (itemType: ItemType | null) => void;
  clearFilters: () => void;
};

export function useItemsCatalogFilters({
  items,
}: UseItemsCatalogFiltersParams): UseItemsCatalogFiltersResult {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);

  const filteredItems = useMemo(() => {
    return filterItems({
      items,
      search,
      selectedType,
    });
  }, [items, search, selectedType]);

  const hasActiveFilters = useMemo(() => {
    return search.trim().length > 0 || selectedType !== null;
  }, [search, selectedType]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedType(null);
  }, []);

  return {
    search,
    selectedType,
    filteredItems,
    hasActiveFilters,
    setSearch,
    setSelectedType,
    clearFilters,
  };
}