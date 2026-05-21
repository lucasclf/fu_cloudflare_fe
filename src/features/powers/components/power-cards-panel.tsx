import type { CSSProperties } from "react";
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
    <div style={styles.wrapper}>
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

          <span style={styles.levelBadge}>{formatMaxLevel(power.max_level)}</span>

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
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },

  card: {
    minHeight: "260px",
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

  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  heroicBadge: {
    border: "1px solid #8a6a25",
    background: "#241c10",
    color: "#e8c875",
  },

  commonBadge: {
    border: "1px solid #5a4630",
    background: "#241d18",
    color: "#d4c9b0",
  },

  levelBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
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
    color: "#e8c875",
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
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    background: "#1e1a16",
    color: "#c9963a",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  unrestrictedJobBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #4c4338",
    borderRadius: "999px",
    background: "#1b1713",
    color: "#d4c9b0",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  description: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    flex: 1,
  },

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};