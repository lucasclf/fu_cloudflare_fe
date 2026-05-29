import { CategorySwitcher } from "@/features/catalog/components/category-switcher";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { CatalogSearchExtra } from "@/features/catalog/components/catalog-search-extra";
import type { CatalogCategory } from "@/features/catalog/types/category";
import { ItemsCatalogMainContent } from "../components/items-catalog-main-content";
import { ItemsCatalogSidebarContent } from "../components/items-catalog-sidebar-content";
import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
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
    typeCounts,
    totalCount,
    hasActiveFilters,
    setSearch,
    setSelectedType,
    clearFilters,
  } = useItemsCatalogFilters({
    items: items ?? [],
  });

  return (
    <CatalogLayout
      sidebarHeaderTitle={ITEMS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={ITEMS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={ITEMS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <CatalogSearchExtra
          hasActiveFilters={hasActiveFilters}
          clearButtonLabel={ITEMS_CATALOG_CONFIG.copy.filters.clearButtonLabel}
          onClearFilters={clearFilters}
        />
      }
      sidebarContent={
        <ItemsCatalogSidebarContent
          loading={loading}
          error={error}
          selectedType={selectedType}
          typeCounts={typeCounts}
          totalCount={totalCount}
          onSelectType={(type) => {
            setSelectedType(type);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
