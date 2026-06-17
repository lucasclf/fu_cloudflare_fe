import type { CSSProperties } from "react";
import panelStyles from "./spell-cards-panel.module.css";
import {
  getSpellSourceName,
  isSpellOffensive,
  renderSpellValue,
} from "../lib/spell-formatters";
import type { Spell } from "../types/spell";

type Props = {
  spells: Spell[];
};

export function SpellCardsPanel({ spells }: Props) {
  if (spells.length === 0) {
    return <div style={styles.empty}>Nenhuma magia para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {spells.map((spell) => (
        <SpellCard key={getSpellCardKey(spell)} spell={spell} />
      ))}
    </div>
  );
}

type SpellCardProps = {
  spell: Spell;
};

function getSpellCardKey(spell: Spell): string {
  if (spell.nature === "monster") {
    return `monster-${spell.id}`;
  }

  return `job-${spell.job_id ?? "unknown"}-${spell.id}`;
}

function SpellCard({ spell }: SpellCardProps) {
  const offensive = isSpellOffensive(spell.is_offensive);
  const sourceName = getSpellSourceName(spell);

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badges}>
          <span style={styles.jobBadge}>{sourceName}</span>

          <span
            style={{
              ...styles.typeBadge,
              ...(offensive ? styles.offensiveBadge : styles.supportBadge),
            }}
          >
            {offensive ? "Ofensiva" : "Não ofensiva"}
          </span>
        </div>

        <h2 style={styles.title}>{spell.name}</h2>
      </div>

      <p style={styles.description}>{renderSpellValue(spell.description)}</p>

      <div style={styles.infoGrid}>
        <Info label="Custo" value={renderSpellValue(spell.cost)} />
        <Info label="Alvo" value={renderSpellValue(spell.target)} />
        <Info label="Duração" value={renderSpellValue(spell.duration)} />
      </div>
    </article>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div style={styles.info}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    minHeight: "280px",
    background: "#131018",
    border: "1px solid #3d2d5c",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
  },
  jobBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #7c3aed",
    borderRadius: "999px",
    background: "#1c1826",
    color: "#a855f7",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },
  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },
  offensiveBadge: {
    border: "1px solid rgba(248, 113, 113, 0.48)",
    background: "rgba(127, 29, 29, 0.22)",
    color: "#fca5a5",
  },
  supportBadge: {
    border: "1px solid #3d2d5c",
    background: "#1c1826",
    color: "#e2d9f3",
  },
  title: {
    margin: 0,
    color: "#c084fc",
    fontSize: "22px",
    lineHeight: 1.15,
  },
  description: {
    margin: 0,
    color: "#e2d9f3",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    flex: 1,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "auto",
  },
  info: {
    border: "1px solid #3d2d5c",
    borderRadius: "8px",
    background: "#0b0a0f",
    padding: "9px 10px",
    minWidth: 0,
  },
  infoLabel: {
    color: "#8b7aa8",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  infoValue: {
    color: "#e2d9f3",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.25,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  empty: {
    color: "#8b7aa8",
    fontStyle: "italic",
  },
};
