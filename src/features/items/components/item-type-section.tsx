import { CollapsibleSection } from "@/shared/components/collapsible-section";
import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import type { Item, ItemType } from "../types/item";
import { ItemCard } from "./item-card";

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

  return (
    <CollapsibleSection
      id={sectionId}
      title={ITEMS_CATALOG_CONFIG.types.labels[itemType]}
      count={items.length}
      isExpanded={isExpanded}
      onToggle={() => onToggle(itemType)}
      contentClassName="item-cards-panel__cards"
    >
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEditItem && editableItemIds?.has(item.id) ? () => onEditItem(item) : undefined}
        />
      ))}
    </CollapsibleSection>
  );
}
