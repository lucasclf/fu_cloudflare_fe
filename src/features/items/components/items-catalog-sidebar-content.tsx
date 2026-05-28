import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
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
  if (loading) {
    return (
      <LoadingState message={ITEMS_CATALOG_COPY.sidebar.loadingMessage} />
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <ItemCategoryFilterSidebar
      selectedType={selectedType}
      onSelectType={onSelectType}
    />
  );
}