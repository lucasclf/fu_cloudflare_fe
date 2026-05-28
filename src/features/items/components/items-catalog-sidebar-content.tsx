import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import type { ItemType } from "../types/item";
import { ItemCategoryFilterSidebar } from "./item-category-filter-sidebar";

type ItemsCatalogSidebarContentProps = {
  loading: boolean;
  error: string | null;
  selectedType: ItemType | null;
  onSelectType: (itemType: ItemType | null) => void;
};

export function ItemsCatalogSidebarContent({
  loading,
  error,
  selectedType,
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
        onSelectType={onSelectType}
      />
    </CatalogStateBoundary>
  );
}
