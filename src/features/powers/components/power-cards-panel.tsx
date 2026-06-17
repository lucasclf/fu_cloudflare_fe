import type { CSSProperties } from "react";
import panelStyles from "./power-cards-panel.module.css";
import {
  formatMaxLevel,
  formatPowerType,
  getPowerJobNames,
  isPowerUnrestricted,
} from "../lib/power-formatters";
import type { Power } from "../types/power";

type Props = {
  powers: Power[];
};

export function PowerCardsPanel({ powers }: Props) {
  if (powers.length === 0) {
    return <div style={styles.empty}>Nenhum poder para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {powers.map((power) => (
        <PowerCard key={power.id} power={power} />
      ))}
    </div>
  );
}

type PowerCardProps = {
  power: Power;
};

function PowerCard({ power }: PowerCardProps) {
  const jobNames = getPowerJobNames(power);
  const unrestricted = isPowerUnrestricted(power);
  const heroic = power.type === "heroic";

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badges}>
          <span
            style={{
              ...styles.typeBadge,
              ...(heroic ? styles.heroicBadge : styles.commonBadge),
            }}
          >
            {formatPowerType(power.type)}
          </span>

          <span style={styles.levelBadge}>
            {formatMaxLevel(power.max_level)}
          </span>

          {power.is_global ? (
            <span style={styles.globalBadge}>Global</span>
          ) : null}
        </div>

        <h2 style={styles.title}>{power.name}</h2>
      </div>

      <div style={styles.jobs}>
        {unrestricted ? (
          <span style={styles.unrestrictedJobBadge}>
            Sem restrição de classe
          </span>
        ) : (
          jobNames.map((jobName) => (
            <span key={jobName} style={styles.jobBadge}>
              {jobName}
            </span>
          ))
        )}
      </div>

      <p style={styles.description}>{power.description}</p>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    minHeight: "260px",
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

  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  heroicBadge: {
    border: "1px solid #7c3aed",
    background: "#1c1826",
    color: "#c084fc",
  },

  commonBadge: {
    border: "1px solid #3d2d5c",
    background: "#1c1826",
    color: "#e2d9f3",
  },

  levelBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #3d2d5c",
    borderRadius: "999px",
    background: "#0b0a0f",
    color: "#8b7aa8",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  globalBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #3f5f45",
    borderRadius: "999px",
    background: "#122016",
    color: "#9fd7a5",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  title: {
    margin: 0,
    color: "#c084fc",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  jobs: {
    display: "flex",
    flexWrap: "wrap",
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

  unrestrictedJobBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #3d2d5c",
    borderRadius: "999px",
    background: "#1c1826",
    color: "#e2d9f3",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  description: {
    margin: 0,
    color: "#e2d9f3",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    flex: 1,
  },

  empty: {
    color: "#8b7aa8",
    fontStyle: "italic",
  },
};
