import type { CSSProperties } from "react";
import { isSpellOffensive, renderSpellValue } from "../lib/spell-formatters";
import type { Spell } from "../types/spell";

type Props = {
  spells: Spell[];
};

export function SpellCardsPanel({ spells }: Props) {
  if (spells.length === 0) {
    return <div style={styles.empty}>Nenhuma magia para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {spells.map((spell) => (
        <SpellCard key={spell.id} spell={spell} />
      ))}
    </div>
  );
}

type SpellCardProps = {
  spell: Spell;
};

function SpellCard({ spell }: SpellCardProps) {
  const offensive = isSpellOffensive(spell.is_offensive);

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badges}>
          <span style={styles.jobBadge}>{spell.job_name}</span>

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
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },
  card: {
    minHeight: "280px",
    background: "#161210",
    border: "1px solid #3a2e22",
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
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    background: "#1e1a16",
    color: "#c9963a",
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
    border: "1px solid #8a372e",
    background: "#251311",
    color: "#e68b7d",
  },
  supportBadge: {
    border: "1px solid #5a4630",
    background: "#241d18",
    color: "#d4c9b0",
  },
  title: {
    margin: 0,
    color: "#e8c875",
    fontSize: "22px",
    lineHeight: 1.15,
  },
  description: {
    margin: 0,
    color: "#d4c9b0",
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
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "9px 10px",
  },
  infoLabel: {
    color: "#7a6e5a",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  infoValue: {
    color: "#f5efe2",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.25,
  },
  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};