import type { CSSProperties } from "react";
import { getNpcImageSrc } from "../lib/get-npc-image-src";
import { renderNpcValue } from "../lib/npc-formatters";
import type { NpcSummary } from "../types/npc";

type Props = {
  npcs: NpcSummary[];
  selectedNpcId: number | null;
  onSelectNpc: (npcId: number) => void;
};

export function NpcCardsPanel({ npcs, selectedNpcId, onSelectNpc }: Props) {
  if (npcs.length === 0) {
    return <div style={styles.empty}>Nenhum NPC para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {npcs.map((npc) => (
        <NpcSummaryCard
          key={npc.id}
          npc={npc}
          selected={selectedNpcId === npc.id}
          onClick={() => onSelectNpc(npc.id)}
        />
      ))}
    </div>
  );
}

function NpcSummaryCard({
  npc,
  selected,
  onClick,
}: {
  npc: NpcSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const imageSrc = getNpcImageSrc(npc.img_key);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.card,
        ...(selected ? styles.cardSelected : {}),
      }}
    >
      <div style={styles.imageFrame}>
        {imageSrc ? (
          <img src={imageSrc} alt={npc.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>{npc.name}</h2>

        <p style={styles.tagline}>“{renderNpcValue(npc.tagline)}”</p>

        <div style={styles.infoGrid}>
          <Info label="Nível" value={npc.level} />
          <Info label="DES" value={npc.dexterity_die} />
          <Info label="AST" value={npc.insight_die} />
          <Info label="VIG" value={npc.might_die} />
          <Info label="VON" value={npc.willpower_die} />
        </div>
      </div>
    </button>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div style={styles.info}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{renderNpcValue(value)}</span>
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
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    background: "#161210",
    color: "inherit",
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "180px 1fr",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  },

  cardSelected: {
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.24)",
  },

  imageFrame: {
    background: "#0e0c0a",
    borderBottom: "1px solid #3a2e22",
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
    color: "#5f574c",
    fontSize: "13px",
    fontStyle: "italic",
  },

  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  title: {
    margin: 0,
    color: "#e8c875",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  tagline: {
    margin: 0,
    color: "#9f8f73",
    fontSize: "13px",
    lineHeight: 1.4,
    fontStyle: "italic",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "8px",
    marginTop: "auto",
  },

  info: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
  },

  infoLabel: {
    color: "#7a6e5a",
    fontSize: "10px",
    fontWeight: 800,
  },

  infoValue: {
    color: "#f5efe2",
    fontSize: "14px",
    fontWeight: 900,
  },

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};