import { AttributeGrid } from "@/shared/components/attribute-grid";
import { getItemAttributes } from "../lib/item-attributes";
import type { Item } from "../types/item";
import { ItemCardHeader } from "./item-card-header";

import "./item-card.css";

type ItemCardProps = {
  item: Item;
  onEdit?: () => void;
};

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const attributes = getItemAttributes(item);

  return (
    <article className="item-card">
      <ItemCardHeader item={item} onEdit={onEdit} />

      <AttributeGrid items={attributes.items} columns={attributes.columns} />
    </article>
  );
}
