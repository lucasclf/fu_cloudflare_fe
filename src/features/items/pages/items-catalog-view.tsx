import { Button } from "../../../shared/components/button";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ItemsCatalogMainContent } from "../components/items-catalog-main-content";
import { ItemsCatalogSidebarContent } from "../components/items-catalog-sidebar-content";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import { useItemsCatalogFilters } from "../hooks/use-items-catalog-filters";
import { usePublicItems } from "../hooks/use-public-items";

type ItemsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function ItemsCatalogView({
  category,
  onCategoryChange,
}: ItemsCatalogViewProps) {
  const { data: items, loading, error } = usePublicItems();

  const {
    search,
    selectedType,
    filteredItems,
    hasActiveFilters,
    setSearch,
    setSelectedType,
    clearFilters,
  } = useItemsCatalogFilters({
    items: items ?? [],
  });

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
      searchExtraContent={
        hasActiveFilters ? (
          <Button variant="ghost" fullWidth onClick={clearFilters}>
            {ITEMS_CATALOG_COPY.filters.clearButtonLabel}
          </Button>
        ) : null
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