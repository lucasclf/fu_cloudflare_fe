import type { ItemType } from "../types/item";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "../types/item";

type Props = {
  selectedTypes: ItemType[];
  onToggleType: (itemType: ItemType) => void;
  onClearTypes: () => void;
};

export function ItemCategoryFilterSidebar({
  selectedTypes,
  onToggleType,
  onClearTypes,
}: Props) {
  return (
    <div>
      <button onClick={onClearTypes} style={styles.clearButton}>
        Mostrar todas
      </button>

      <div style={styles.list}>
        {ITEM_TYPE_OPTIONS.map((itemType) => {
          const checked = selectedTypes.includes(itemType);

          return (
            <label key={itemType} style={styles.option}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleType(itemType)}
              />
              <span>{ITEM_TYPE_LABELS[itemType]}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  clearButton: {
    width: "calc(100% - 24px)",
    margin: "0 12px 10px",
    padding: "8px 10px",
    background: "transparent",
    border: "1px solid #7a5a22",
    color: "#c9963a",
    borderRadius: "4px",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "0 12px 12px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 4px",
    color: "#d4c9b0",
    cursor: "pointer",
  },
};