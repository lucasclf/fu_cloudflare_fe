import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
} from "./job-feature-definitions";
import {
  getPositiveJobBonus,
  isJobAllowanceEnabled,
} from "../lib/job-feature-filters";
import { getJobImageSrc } from "../lib/get-job-image-src";
import type { JobCatalogItem } from "../types/job";

import "./job-catalog-panel.css";

type JobCatalogPanelProps = {
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
    <div
      className="job-catalog-panel__allowance-bar"
      aria-label="Características da classe"
    >
      {ALLOWANCE_DEFINITIONS.map(({ key, label, Icon }) => {
        const enabled = isJobAllowanceEnabled(job[key]);
        const status = enabled ? "permitido" : "não permitido";

        return (
          <span
            key={key}
            className={getAllowanceChipClassName(enabled)}
            title={`${label}: ${status}`}
            aria-label={`${label}: ${status}`}
          >
            <Icon />
          </span>
        );
      })}

      {BONUS_DEFINITIONS.map(({ key, label, shortLabel, Icon }) => {
        const value = getPositiveJobBonus(job[key]);
        const enabled = value > 0;
        const status = enabled ? `+${value} ${shortLabel}` : "sem bônus";

        return (
          <span
            key={key}
            className={getBonusChipClassName(enabled)}
            title={`${label}: ${status}`}
            aria-label={`${label}: ${status}`}
          >
            <Icon />

            {enabled ? (
              <span className="job-catalog-panel__bonus-value">+{value}</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function JobCatalogPanel({ jobs, onSelect }: JobCatalogPanelProps) {
  if (jobs.length === 0) {
    return (
      <p className="job-catalog-panel__empty">Nenhuma classe para exibir.</p>
    );
  }

  return (
    <div className="job-catalog-panel">
      {jobs.map((job) => {
        const imageSrc = getJobImageSrc(job.imageKey);

        return (
          <button
            key={job.id}
            type="button"
            className="job-catalog-panel__card"
            aria-label={`Ver detalhes da classe ${job.name}`}
            onClick={() => onSelect(job.id)}
          >
            <div className="job-catalog-panel__image-wrapper">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt=""
                  className="job-catalog-panel__image"
                  aria-hidden
                />
              ) : (
                <span className="job-catalog-panel__initials">
                  {getInitials(job.name)}
                </span>
              )}
            </div>

            <h2 className="job-catalog-panel__title">{job.name}</h2>

            {job.tagline ? (
              <p className="job-catalog-panel__tagline">{job.tagline}</p>
            ) : null}

            <JobAllowanceIcons job={job} />
          </button>
        );
      })}
    </div>
  );
}

function getAllowanceChipClassName(enabled: boolean): string {
  return [
    "job-catalog-panel__allowance-chip",
    enabled
      ? "job-catalog-panel__allowance-chip--enabled"
      : "job-catalog-panel__allowance-chip--disabled",
  ]
    .filter(Boolean)
    .join(" ");
}

function getBonusChipClassName(enabled: boolean): string {
  return [
    "job-catalog-panel__allowance-chip",
    "job-catalog-panel__bonus-chip",
    enabled
      ? "job-catalog-panel__allowance-chip--enabled"
      : "job-catalog-panel__allowance-chip--disabled",
  ]
    .filter(Boolean)
    .join(" ");
}
