import { useEffect, useMemo, useState } from "react";
import type { Item, ItemType } from "../types/item";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "../types/item";
import { ItemCard } from "./item-card";

type Props = {
  items: Item[];
  selectedType: ItemType | null;
};

export function ItemCardsPanel({ items, selectedType }: Props) {
  const [expandedTypes, setExpandedTypes] = useState<ItemType[]>([]);

  useEffect(() => {
    if (selectedType === null) {
      setExpandedTypes([]);
      return;
    }

    setExpandedTypes((current) =>
      current.includes(selectedType) ? current : [selectedType]
    );
  }, [selectedType]);

  const groupedItems = useMemo(() => {
    return ITEM_TYPE_OPTIONS.reduce<Record<ItemType, Item[]>>((acc, itemType) => {
      acc[itemType] = items.filter((item) => item.item_type === itemType);
      return acc;
    }, {} as Record<ItemType, Item[]>);
  }, [items]);

  const visibleTypes = useMemo(() => {
    if (selectedType !== null) {
      return groupedItems[selectedType].length > 0 ? [selectedType] : [];
    }

    return ITEM_TYPE_OPTIONS.filter((itemType) => groupedItems[itemType].length > 0);
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
    return <div style={styles.empty}>Nenhum item para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {visibleTypes.map((itemType) => {
        const typeItems = groupedItems[itemType];
        const isExpanded = expandedTypes.includes(itemType);

        if (typeItems.length === 0) {
          return null;
        }

        return (
          <section key={itemType} style={styles.section}>
            <button
              onClick={() => toggleType(itemType)}
              style={styles.sectionHeader}
            >
              <div style={styles.sectionTitle}>
                {ITEM_TYPE_LABELS[itemType]}
                <span style={styles.sectionCount}>({typeItems.length})</span>
              </div>

              <span style={styles.sectionIcon}>
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            {isExpanded ? (
              <div style={styles.cards}>
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

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  section: {
    border: "1px solid #3a2e22",
    borderRadius: "8px",
    background: "#120f0d",
    overflow: "hidden",
  },
  sectionHeader: {
    width: "100%",
    background: "#1a1512",
    border: "none",
    borderBottom: "1px solid #3a2e22",
    color: "#d4c9b0",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#e8c875",
  },
  sectionCount: {
    fontSize: "14px",
    color: "#7a6e5a",
    fontWeight: 400,
  },
  sectionIcon: {
    fontSize: "22px",
    color: "#c9963a",
    lineHeight: 1,
  },
  cards: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    padding: "18px",
  },
  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};