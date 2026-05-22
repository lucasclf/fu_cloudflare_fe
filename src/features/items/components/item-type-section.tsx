import { CollapsibleSection } from "../../../shared/components/collapsible-section";
import { ITEM_TYPE_LABELS } from "../config/item-type-config";
import type { Item, ItemType } from "../types/item";
import { ItemCard } from "./item-card";

type ItemTypeSectionProps = {
  itemType: ItemType;
  items: Item[];
  isExpanded: boolean;
  onToggle: (itemType: ItemType) => void;
};

export function ItemTypeSection({
  itemType,
  items,
  isExpanded,
  onToggle,
}: ItemTypeSectionProps) {
  const sectionId = `item-section-${itemType}`;

  return (
    <CollapsibleSection
      id={sectionId}
      title={ITEM_TYPE_LABELS[itemType]}
      count={items.length}
      isExpanded={isExpanded}
      onToggle={() => onToggle(itemType)}
      contentClassName="item-cards-panel__cards"
    >
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </CollapsibleSection>
  );
}