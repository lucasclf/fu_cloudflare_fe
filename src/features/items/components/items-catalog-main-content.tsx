import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { ITEMS_CATALOG_COPY } from "../config/items-catalog-copy";
import type { Item, ItemType } from "../types/item";
import { ItemCardsPanel } from "./item-cards-panel";

type ItemsCatalogMainContentProps = {
  loading: boolean;
  error: string | null;
  items: Item[];
  selectedType: ItemType | null;
  onEditItem?: (item: Item) => void;
  editableItemIds?: Set<number>;
};

export function ItemsCatalogMainContent({
  loading,
  error,
  items,
  selectedType,
  onEditItem,
  editableItemIds,
}: ItemsCatalogMainContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={ITEMS_CATALOG_COPY.main.loadingMessage}
      emptyState={{
        isEmpty: items.length === 0,
        title: ITEMS_CATALOG_COPY.emptyState.title,
        description: ITEMS_CATALOG_COPY.emptyState.description,
      }}
    >
      <ItemCardsPanel items={items} selectedType={selectedType} onEditItem={onEditItem} editableItemIds={editableItemIds} />
    </CatalogStateBoundary>
  );
}
