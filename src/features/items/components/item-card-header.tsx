import type { Item } from "../types/item";
import { ItemCardBadges } from "./item-card-badges";
import { ItemCardImage } from "./item-card-image";

type ItemCardHeaderProps = {
  item: Item;
  onEdit?: () => void;
};

export function ItemCardHeader({ item, onEdit }: ItemCardHeaderProps) {
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

      <div className="item-card__header-actions">
        <ItemCardImage imageKey={item.imageKey} alt={item.name} />

        {onEdit ? (
          <button
            type="button"
            className="item-card__edit-btn"
            onClick={onEdit}
            title="Editar item"
            aria-label={`Editar ${item.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
