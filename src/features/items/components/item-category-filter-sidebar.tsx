import type { ItemType } from "../types/item";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "../types/item";

type Props = {
  selectedType: ItemType | null;
  onSelectType: (itemType: ItemType | null) => void;
};

export function ItemCategoryFilterSidebar({
  selectedType,
  onSelectType,
}: Props) {
  return (
    <div style={styles.list}>
      <button
        onClick={() => onSelectType(null)}
        style={{
          ...styles.optionButton,
          ...(selectedType === null ? styles.optionButtonActive : {}),
        }}
      >
        Todas
      </button>

      {ITEM_TYPE_OPTIONS.map((itemType) => {
        const isActive = selectedType === itemType;

        return (
          <button
            key={itemType}
            onClick={() => onSelectType(itemType)}
            style={{
              ...styles.optionButton,
              ...(isActive ? styles.optionButtonActive : {}),
            }}
          >
            {ITEM_TYPE_LABELS[itemType]}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "0 12px 12px",
  },
  optionButton: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    background: "transparent",
    border: "1px solid #3a2e22",
    color: "#d4c9b0",
    borderRadius: "6px",
    cursor: "pointer",
  },
  optionButtonActive: {
    background: "#1e1a16",
    border: "1px solid #7a5a22",
    color: "#e8c875",
  },
};