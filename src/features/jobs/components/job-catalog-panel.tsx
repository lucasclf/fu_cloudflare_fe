import type { CSSProperties } from "react";
import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
  getPositiveJobBonus,
  isJobAllowanceEnabled,
} from "./job-allowance-icons";
import { getJobImageSrc } from "../lib/get-job-image-src";
import type { JobCatalogItem } from "../types/job";

type Props = {
  jobs: JobCatalogItem[];
  onSelect: (jobId: number) => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function JobAllowanceIcons({ job }: { job: JobCatalogItem }) {

  return (
    <div style={styles.allowanceBar} aria-label="Características da classe">
      {ALLOWANCE_DEFINITIONS.map(({ key, label, icon }) => {
        const enabled = isJobAllowanceEnabled(job[key]);
        const status = enabled ? "permitido" : "não permitido";

        return (
          <span
            key={key}
            title={`${label}: ${status}`}
            aria-label={`${label}: ${status}`}
            style={{
              ...styles.allowanceChip,
              ...(enabled
                ? styles.allowanceChipEnabled
                : styles.allowanceChipDisabled),
            }}
          >
            {icon}
          </span>
        );
      })}

      {BONUS_DEFINITIONS.map(({ key, label, shortLabel, icon }) => {
        const value = getPositiveJobBonus(job[key]);
        const enabled = value > 0;
        const status = enabled ? `+${value} ${shortLabel}` : "sem bônus";

        return (
          <span
            key={key}
            title={`${label}: ${status}`}
            aria-label={`${label}: ${status}`}
            style={{
              ...styles.allowanceChip,
              ...(enabled
                ? styles.allowanceChipEnabled
                : styles.allowanceChipDisabled),
            }}
          >
            {icon}

            {enabled ? (
              <span style={styles.bonusValue}></span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function JobCatalogPanel({ jobs, onSelect }: Props) {
  if (jobs.length === 0) {
    return <div style={styles.empty}>Nenhuma classe para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {jobs.map((job) => {
        const imageSrc = getJobImageSrc(job.img_key);

        return (
          <button
            key={job.id}
            onClick={() => onSelect(job.id)}
            style={styles.card}
          >
            <div style={styles.imageWrapper}>
              {imageSrc ? (
                <img src={imageSrc} alt={job.name} style={styles.image} />
              ) : (
                <span style={styles.initials}>{getInitials(job.name)}</span>
              )}
            </div>

            <h2 style={styles.title}>{job.name}</h2>

            <JobAllowanceIcons job={job} />
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "14px",
  },
  card: {
    width: "100%",
    minHeight: "190px",
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    padding: "16px 14px 14px",
    color: "#d4c9b0",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  imageWrapper: {
    width: "86px",
    height: "86px",
    flexShrink: 0,
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    background: "#1e1a16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "8px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  initials: {
    color: "#c9963a",
    fontWeight: 700,
    fontSize: "22px",
  },
  title: {
    minHeight: "38px",
    margin: 0,
    color: "#e8c875",
    fontSize: "17px",
    lineHeight: 1.15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  allowanceBar: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "auto",
    paddingTop: "4px",
  },
  allowanceChip: {
    width: "24px",
    height: "24px",
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 120ms ease, border-color 120ms ease, opacity 120ms ease",
  },
  allowanceChipEnabled: {
    color: "#f5efe2",
    borderColor: "#7b694b",
    opacity: 1,
  },
  allowanceChipDisabled: {
    color: "#4e463c",
    borderColor: "#2a231d",
    opacity: 0.72,
  },
  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
  bonusChip: {
    width: "auto",
    minWidth: "34px",
    padding: "0 6px",
    gap: "3px",
  },

  bonusValue: {
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: 1,
  },
};
