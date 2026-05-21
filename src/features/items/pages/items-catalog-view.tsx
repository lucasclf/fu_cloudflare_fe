import { useCallback, useMemo, useState } from "react";

import { useAsyncResource } from "../../../shared/hooks/use-async-resource";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicItems } from "../api/get-public-items";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import { ItemsCatalogMainContent } from "../components/items-catalog-main-content";
import { ItemsCatalogSidebarContent } from "../components/items-catalog-sidebar-content";
import { filterItems } from "../lib/filter-items";
import type { Item, ItemType } from "../types/item";

type ItemsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function ItemsCatalogView({
  category,
  onCategoryChange,
}: ItemsCatalogViewProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);

  const loadItems = useCallback((signal: AbortSignal) => {
    return getPublicItems(signal);
  }, []);

  const {
    data: items,
    loading,
    error,
  } = useAsyncResource<Item[]>(loadItems);

  const filteredItems = useMemo(() => {
    return filterItems({
      items: items ?? [],
      search,
      selectedType,
    });
  }, [items, search, selectedType]);

  return (
    <CatalogLayout
      sidebarHeaderTitle={ITEMS_CATALOG_COPY.sidebar.headerTitle}
      sidebarHeaderSubtitle={ITEMS_CATALOG_COPY.sidebar.headerSubtitle}
      searchPlaceholder={ITEMS_CATALOG_COPY.search.placeholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        <ItemsCatalogSidebarContent
          loading={loading}
          error={error}
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />
      }
      mainContent={
        <ItemsCatalogMainContent
          loading={loading}
          error={error}
          items={filteredItems}
          selectedType={selectedType}
        />
      }
    />
  );
}