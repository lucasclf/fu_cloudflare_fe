import { ITEMS_CATALOG_CONFIG } from "../config/items-catalog-config";
import { formatItemCategoryBadgeValue } from "../lib/item-formatters";
import type { Item } from "../types/item";

type ItemCardBadgesProps = {
  item: Item;
};

export function ItemCardBadges({ item }: ItemCardBadgesProps) {
  const categoryBadge = formatItemCategoryBadgeValue(item.weaponCategory);

  return (
    <div className="item-card__badges">
      <span className="item-card__badge">
        {ITEMS_CATALOG_CONFIG.types.labels[item.itemType]}
      </span>

      {item.itemType === "arma" && categoryBadge ? (
        <span className="item-card__badge">{categoryBadge}</span>
      ) : null}
    </div>
  );
}
