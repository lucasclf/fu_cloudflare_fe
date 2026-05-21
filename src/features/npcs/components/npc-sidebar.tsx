import type { CSSProperties } from "react";
import { renderNpcValue } from "../lib/npc-formatters";
import type { NpcSummary } from "../types/npc";

type Props = {
  npcs: NpcSummary[];
  selectedNpcId: number | null;
  onSelectNpc: (npcId: number) => void;
};

export function NpcSidebar({ npcs, selectedNpcId, onSelectNpc }: Props) {
  if (npcs.length === 0) {
    return <div style={styles.empty}>Nenhum NPC encontrado.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {npcs.map((npc) => {
        const selected = selectedNpcId === npc.id;

        return (
          <button
            key={npc.id}
            type="button"
            onClick={() => onSelectNpc(npc.id)}
            style={{
              ...styles.button,
              ...(selected ? styles.buttonActive : {}),
            }}
          >
            <span style={styles.name}>{npc.name}</span>
            <span style={styles.tagline}>{renderNpcValue(npc.tagline)}</span>
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
    color: "#7a6e5a",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    cursor: "pointer",
    textAlign: "left",
  },

  buttonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },

  name: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 800,
    lineHeight: 1.2,
  },

  tagline: {
    color: "#9f8f73",
    fontSize: "12px",
    lineHeight: 1.35,
    fontStyle: "italic",
  },

  empty: {
    padding: "12px 16px 16px",
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};