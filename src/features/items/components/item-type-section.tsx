import { CollapsibleSection } from "@/shared/components/collapsible-section";
import { LoadMoreButton } from "@/shared/components/load-more-button";
import { usePaginatedList } from "@/shared/hooks/use-paginated-list";
import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import type { Item, ItemType } from "../types/item";
import { ItemCard } from "./item-card";

const PAGE_SIZE = 20;

type ItemTypeSectionProps = {
  itemType: ItemType;
  items: Item[];
  isExpanded: boolean;
  onToggle: (itemType: ItemType) => void;
  onEditItem?: (item: Item) => void;
  editableItemIds?: Set<number>;
};

export function ItemTypeSection({
  itemType,
  items,
  isExpanded,
  onToggle,
  onEditItem,
  editableItemIds,
}: ItemTypeSectionProps) {
  const sectionId = `item-section-${itemType}`;
  const { visibleItems, hasMore, remaining, loadMore } = usePaginatedList(
    items,
    PAGE_SIZE,
  );

  return (
    <CollapsibleSection
      id={sectionId}
      title={ITEMS_CATALOG_CONFIG.types.labels[itemType]}
      count={items.length}
      isExpanded={isExpanded}
      onToggle={() => onToggle(itemType)}
      contentClassName="item-cards-panel__cards"
    >
      {visibleItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEditItem && editableItemIds?.has(item.id) ? () => onEditItem(item) : undefined}
        />
      ))}

      {hasMore ? (
        <LoadMoreButton remaining={remaining} onClick={loadMore} />
      ) : null}
    </CollapsibleSection>
  );
}
