import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { CatalogSearchExtra } from "@/features/catalog/components/catalog-search-extra";
import { ItemsCatalogMainContent } from "@/features/items/components/items-catalog-main-content";
import { ItemsCatalogSidebarContent } from "@/features/items/components/items-catalog-sidebar-content";
import { ITEMS_CATALOG_CONFIG } from "@/features/items/config/items-catalog-config";
import { useItemsCatalogFilters } from "@/features/items/hooks/use-items-catalog-filters";
import { usePublicItems } from "@/features/items/hooks/use-public-items";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignItems } from "../hooks/use-campaign-items";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import { ItemFormModal } from "./item-form-modal";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";
import type { Item } from "@/features/items/types/item";

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
  const { data: contextData } = useCampaignHomeContext();
  const isMaster = contextData.role === "master";

  const global = usePublicItems(true);
  const campaign = useCampaignItems(campaignId);
  const { data: items, loading, error } = useCombinedCatalog(global, campaign);

  const campaignItemIds = useMemo<Set<number>>(() => {
    return new Set((campaign.data ?? []).map((i) => i.id));
  }, [campaign.data]);

  const [editingItem, setEditingItem] = useState<Item | null>(null);

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

  function handleEditSuccess() {
    setEditingItem(null);
    campaign.reload?.();
  }

  return (
    <>
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
            onEditItem={isMaster ? setEditingItem : undefined}
            editableItemIds={isMaster ? campaignItemIds : undefined}
          />
        }
      />

      {editingItem ? (
        <ItemFormModal
          campaignId={campaignId}
          initialItem={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditSuccess}
        />
      ) : null}
    </>
  );
}
