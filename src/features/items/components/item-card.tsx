import { AttributeGrid } from "@/shared/components/attribute-grid";
import { getItemAttributes } from "../lib/item-attributes";
import type { Item } from "../types/item";
import { ItemCardHeader } from "./item-card-header";

import "./item-card.css";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const attributes = getItemAttributes(item);

  return (
    <article className="item-card">
      <ItemCardHeader item={item} />

      <AttributeGrid items={attributes.items} columns={attributes.columns} />
    </article>
  );
}
