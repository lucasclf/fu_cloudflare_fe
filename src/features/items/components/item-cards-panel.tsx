import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "../../../shared/components/empty-state";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "../config/item-type-config";
import type { Item, ItemType } from "../types/item";
import { ItemCard } from "./item-card";

import "./item-cards-panel.css";

type ItemCardsPanelProps = {
  items: Item[];
  selectedType: ItemType | null;
};

const EMPTY_GROUPED_ITEMS: Record<ItemType, Item[]> = {
  arma: [],
  armadura: [],
  escudo: [],
  acessorio: [],
  artefato: [],
  outros: [],
};

export function ItemCardsPanel({
  items,
  selectedType,
}: ItemCardsPanelProps) {
  const [expandedTypes, setExpandedTypes] = useState<ItemType[]>([]);

  useEffect(() => {
    if (selectedType === null) {
      setExpandedTypes([]);
      return;
    }

    setExpandedTypes((current) =>
      current.includes(selectedType) ? current : [selectedType],
    );
  }, [selectedType]);

  const groupedItems = useMemo(() => {
    return ITEM_TYPE_OPTIONS.reduce<Record<ItemType, Item[]>>(
      (accumulator, itemType) => {
        accumulator[itemType] = items.filter(
          (item) => item.item_type === itemType,
        );

        return accumulator;
      },
      { ...EMPTY_GROUPED_ITEMS },
    );
  }, [items]);

  const visibleTypes = useMemo(() => {
    if (selectedType !== null) {
      return groupedItems[selectedType].length > 0 ? [selectedType] : [];
    }

    return ITEM_TYPE_OPTIONS.filter(
      (itemType) => groupedItems[itemType].length > 0,
    );
  }, [groupedItems, selectedType]);

  function toggleType(itemType: ItemType) {
    setExpandedTypes((current) => {
      if (current.includes(itemType)) {
        return current.filter((value) => value !== itemType);
      }

      return [...current, itemType];
    });
  }

  if (visibleTypes.length === 0) {
    return (
      <EmptyState
        title="Nenhum item para exibir"
        description="Tente ajustar os filtros ou buscar por outro nome."
      />
    );
  }

  return (
    <div className="item-cards-panel">
      {visibleTypes.map((itemType) => {
        const typeItems = groupedItems[itemType];
        const isExpanded = expandedTypes.includes(itemType);
        const sectionId = `item-section-${itemType}`;

        return (
          <section key={itemType} className="item-cards-panel__section">
            <button
              type="button"
              className="item-cards-panel__section-header"
              aria-expanded={isExpanded}
              aria-controls={sectionId}
              onClick={() => toggleType(itemType)}
            >
              <span className="item-cards-panel__section-title">
                {ITEM_TYPE_LABELS[itemType]}

                <span className="item-cards-panel__section-count">
                  ({typeItems.length})
                </span>
              </span>

              <span className="item-cards-panel__section-icon" aria-hidden>
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            {isExpanded ? (
              <div id={sectionId} className="item-cards-panel__cards">
                {typeItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}