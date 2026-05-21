import { ITEM_TYPE_LABELS } from "../config/item-type-config";
import { formatItemCategoryBadgeValue } from "../lib/item-formatters";
import type { Item } from "../types/item";

type ItemCardBadgesProps = {
  item: Item;
};

export function ItemCardBadges({ item }: ItemCardBadgesProps) {
  const categoryBadge = formatItemCategoryBadgeValue(item.weapon_category);

  return (
    <div className="item-card__badges">
      <span className="item-card__badge">
        {ITEM_TYPE_LABELS[item.item_type]}
      </span>

      {item.item_type === "arma" && categoryBadge ? (
        <span className="item-card__badge">{categoryBadge}</span>
      ) : null}
    </div>
  );
}