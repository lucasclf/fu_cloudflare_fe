import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import type { ItemType } from "../types/item";
import { ItemCategoryFilterSidebar } from "./item-category-filter-sidebar";

type ItemsCatalogSidebarContentProps = {
  loading: boolean;
  error: string | null;
  selectedType: ItemType | null;
  typeCounts: Partial<Record<ItemType, number>>;
  totalCount: number;
  onSelectType: (itemType: ItemType | null) => void;
};

export function ItemsCatalogSidebarContent({
  loading,
  error,
  selectedType,
  typeCounts,
  totalCount,
  onSelectType,
}: ItemsCatalogSidebarContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={ITEMS_CATALOG_COPY.sidebar.loadingMessage}
    >
      <ItemCategoryFilterSidebar
        selectedType={selectedType}
        typeCounts={typeCounts}
        totalCount={totalCount}
        onSelectType={onSelectType}
      />
    </CatalogStateBoundary>
  );
}
