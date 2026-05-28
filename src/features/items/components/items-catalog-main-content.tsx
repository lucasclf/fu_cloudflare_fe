import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import type { Item, ItemType } from "../types/item";
import { ItemCardsPanel } from "./item-cards-panel";

type ItemsCatalogMainContentProps = {
  loading: boolean;
  error: string | null;
  items: Item[];
  selectedType: ItemType | null;
};

export function ItemsCatalogMainContent({
  loading,
  error,
  items,
  selectedType,
}: ItemsCatalogMainContentProps) {
  if (loading) {
    return <LoadingState message={ITEMS_CATALOG_COPY.main.loadingMessage} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={ITEMS_CATALOG_COPY.emptyState.title}
        description={ITEMS_CATALOG_COPY.emptyState.description}
      />
    );
  }

  return <ItemCardsPanel items={items} selectedType={selectedType} />;
}