import type { CSSProperties } from "react";
import { renderPcValue } from "../lib/pc-formatters";
import type { PcSummary } from "../types/pc";

type Props = {
  pcs: PcSummary[];
  selectedPcId: number | null;
  onSelectPc: (pcId: number) => void;
};

export function PcSidebar({ pcs, selectedPcId, onSelectPc }: Props) {
  if (pcs.length === 0) {
    return <div style={styles.empty}>Nenhum personagem encontrado.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {pcs.map((pc) => {
        const selected = selectedPcId === pc.id;

        return (
          <button
            key={pc.id}
            type="button"
            onClick={() => onSelectPc(pc.id)}
            style={{
              ...styles.button,
              ...(selected ? styles.buttonActive : {}),
            }}
          >
            <span style={styles.name}>{pc.name}</span>
            <span style={styles.tagline}>{renderPcValue(pc.tagline)}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    padding: "12px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  button: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    cursor: "pointer",
    textAlign: "left",
  },

  buttonActive: {
    background: "#1e1a16",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },

  name: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 800,
  },

  tagline: {
    color: "#9f8f73",
    fontSize: "12px",
    lineHeight: 1.35,
    fontStyle: "italic",
  },

  empty: {
    padding: "12px 16px",
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};