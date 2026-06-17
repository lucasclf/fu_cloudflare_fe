import type { CSSProperties } from "react";
import { renderPcValue } from "../lib/pc-formatters";
import type { PcSummary } from "../types/pc";

type Props = {
  pcs: PcSummary[];
  selectedPcId: number | null;
  onSelectPc: (pcId: number) => void;
};

export function PcCardsPanel({ pcs, selectedPcId, onSelectPc }: Props) {
  if (pcs.length === 0) {
    return <div style={styles.empty}>Nenhum personagem para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {pcs.map((pc) => (
        <button
          key={pc.id}
          type="button"
          onClick={() => onSelectPc(pc.id)}
          style={{
            ...styles.card,
            ...(selectedPcId === pc.id ? styles.cardSelected : {}),
          }}
        >
          <div style={styles.imageFrame}>
            {pc.img_key ? (
              <img src={pc.img_key} alt={pc.name} style={styles.image} />
            ) : (
              <div style={styles.imagePlaceholder}>Sem imagem</div>
            )}
          </div>

          <div style={styles.content}>
            <h2 style={styles.title}>{pc.name}</h2>
            <p style={styles.tagline}>“{renderPcValue(pc.tagline)}”</p>
          </div>
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  card: {
    minHeight: "260px",
    border: "1px solid #3d2d5c",
    borderRadius: "10px",
    background: "#131018",
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "190px 1fr",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  },

  cardSelected: {
    borderColor: "#a855f7",
    boxShadow: "0 0 0 1px rgba(168, 85, 247, 0.24)",
  },

  imageFrame: {
    background: "#0b0a0f",
    borderBottom: "1px solid #3d2d5c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    padding: "10px",
    boxSizing: "border-box",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8b7aa8",
    fontSize: "13px",
    fontStyle: "italic",
  },

  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  title: {
    margin: 0,
    color: "#c084fc",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  tagline: {
    margin: 0,
    color: "#8b7aa8",
    fontSize: "13px",
    lineHeight: 1.4,
    fontStyle: "italic",
  },

  empty: {
    color: "#8b7aa8",
    fontStyle: "italic",
  },
};
