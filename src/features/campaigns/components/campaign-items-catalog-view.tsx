import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { CatalogSearchExtra } from "@/features/catalog/components/catalog-search-extra";
import { ItemsCatalogMainContent } from "@/features/items/components/items-catalog-main-content";
import { ItemsCatalogSidebarContent } from "@/features/items/components/items-catalog-sidebar-content";
import { ITEMS_CATALOG_CONFIG } from "@/features/items/config/items-catalog-config";
import { useItemsCatalogFilters } from "@/features/items/hooks/use-items-catalog-filters";
import { usePublicItems } from "@/features/items/hooks/use-public-items";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignItems } from "../hooks/use-campaign-items";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

type CampaignItemsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignItemsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignItemsCatalogViewProps) {
  const global = usePublicItems(true);
  const campaign = useCampaignItems(campaignId);
  const { data: items, loading, error } = useCombinedCatalog(global, campaign);

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
  } = useItemsCatalogFilters({ items: items ?? [] });

  return (
    <CatalogLayout
      sidebarHeaderTitle={ITEMS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={ITEMS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={ITEMS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
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
