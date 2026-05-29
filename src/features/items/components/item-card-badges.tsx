import { Badge } from "../../../shared/components/badge";
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
      <Badge variant="accent">
        {ITEMS_CATALOG_CONFIG.types.labels[item.itemType]}
      </Badge>

      {item.itemType === "arma" && categoryBadge ? (
        <Badge variant="accent">{categoryBadge}</Badge>
      ) : null}
    </div>
  );
}
