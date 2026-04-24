import type { Item } from "../types/item";
import { ItemCard } from "./item-card";

type Props = {
  items: Item[];
};

export function ItemCardsPanel({ items }: Props) {
  if (items.length === 0) {
    return <div style={styles.empty}>Nenhum item para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};