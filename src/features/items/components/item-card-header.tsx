import type { Item } from "../types/item";
import { ItemCardBadges } from "./item-card-badges";
import { ItemCardImage } from "./item-card-image";

type ItemCardHeaderProps = {
  item: Item;
};

export function ItemCardHeader({ item }: ItemCardHeaderProps) {
  return (
    <div className="item-card__header">
      <div className="item-card__header-text">
        <ItemCardBadges item={item} />

        <h2 className="item-card__title">
          {item.name}

          {item.isMartial ? (
            <span className="item-card__martial-icon" title="Item marcial">
              {" "}
              ⛧
            </span>
          ) : null}
        </h2>

        {item.cost !== null && item.cost !== 0 ? (
          <div className="item-card__cost">{item.cost}z</div>
        ) : null}
      </div>

      <ItemCardImage imageKey={item.imageKey} alt={item.name} />
    </div>
  );
}
