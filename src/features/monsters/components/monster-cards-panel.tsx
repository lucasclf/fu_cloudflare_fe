import type { CSSProperties } from "react";
import { getMonsterImageSrc } from "../lib/get-monster-image-src";
import { formatMonsterType } from "../lib/monster-formatters";
import type { MonsterSummary } from "../types/monster";

type Props = {
  monsters: MonsterSummary[];
  selectedMonsterId: number | null;
  onSelectMonster: (monsterId: number) => void;
};

export function MonsterCardsPanel({
  monsters,
  selectedMonsterId,
  onSelectMonster,
}: Props) {
  if (monsters.length === 0) {
    return <div style={styles.empty}>Nenhum monstro para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {monsters.map((monster) => (
        <MonsterSummaryCard
          key={monster.id}
          monster={monster}
          selected={selectedMonsterId === monster.id}
          onClick={() => onSelectMonster(monster.id)}
        />
      ))}
    </div>
  );
}

type MonsterSummaryCardProps = {
  monster: MonsterSummary;
  selected: boolean;
  onClick: () => void;
};

function MonsterSummaryCard({
  monster,
  selected,
  onClick,
}: MonsterSummaryCardProps) {
  const imageSrc = getMonsterImageSrc(monster.img_key);

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
          <img src={imageSrc} alt={monster.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.badges}>
          <span style={styles.typeBadge}>
            {formatMonsterType(monster.monster_type)}
          </span>

          <span style={styles.levelBadge}>Nível {monster.level}</span>
        </div>

        <h2 style={styles.title}>{monster.name}</h2>

        <div style={styles.diceGrid}>
          <Die label="DES" value={monster.dexterity_die} />
          <Die label="AST" value={monster.insight_die} />
          <Die label="VIG" value={monster.might_die} />
          <Die label="VON" value={monster.willpower_die} />
        </div>
      </div>
    </button>
  );
}

function Die({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.die}>
      <span style={styles.dieLabel}>{label}</span>
      <span style={styles.dieValue}>{value}</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },

  card: {
    minHeight: "210px",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    background: "#161210",
    color: "inherit",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "34% 1fr",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  },

  cardSelected: {
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.24)",
  },

  imageFrame: {
    minHeight: "210px",
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    minHeight: "210px",
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
    gap: "12px",
  },

  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  typeBadge: {
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    background: "#1e1a16",
    color: "#c9963a",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  levelBadge: {
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  title: {
    margin: 0,
    color: "#e8c875",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  diceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "8px",
    marginTop: "auto",
  },

  die: {
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    alignItems: "center",
  },

  dieLabel: {
    color: "#7a6e5a",
    fontSize: "11px",
    fontWeight: 800,
  },

  dieValue: {
    color: "#f5efe2",
    fontSize: "15px",
    fontWeight: 900,
  },

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};