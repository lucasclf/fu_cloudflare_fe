import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
} from "./job-feature-definitions";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import {
  getPositiveJobBonus,
  isJobAllowanceEnabled,
} from "../lib/job-feature-filters";
import { getJobImageSrc } from "../lib/get-job-image-src";
import type { Job } from "../types/job";

type JobDetailHeroProps = {
  job: Job;
};

export function JobDetailHero({ job }: JobDetailHeroProps) {
  const imageSrc = getJobImageSrc(job.imageKey);

  return (
    <header className="job-detail-panel__hero">
      <div className="job-detail-panel__hero-main">
        <div className="job-detail-panel__hero-image-wrapper">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="job-detail-panel__hero-image"
              aria-hidden
            />
          ) : (
            <span className="job-detail-panel__hero-initials">
              {getInitials(job.name)}
            </span>
          )}
        </div>

        <div className="job-detail-panel__hero-text">
          <span className="job-detail-panel__badge">
            {JOBS_CATALOG_CONFIG.copy.detail.entityBadge}
          </span>

          <h2 className="job-detail-panel__hero-title">{job.name}</h2>

          {job.tagline ? (
            <p className="job-detail-panel__tagline">{job.tagline}</p>
          ) : null}
        </div>
      </div>

      <HeroAllowanceIcons job={job} />
    </header>
  );
}

function HeroAllowanceIcons({ job }: { job: Job }) {
  const enabledAllowances = ALLOWANCE_DEFINITIONS.filter(({ key }) =>
    isJobAllowanceEnabled(job[key]),
  );

  const enabledBonuses = BONUS_DEFINITIONS.map((bonus) => ({
    ...bonus,
    value: getPositiveJobBonus(job[bonus.key]),
  })).filter((bonus) => bonus.value > 0);

  if (enabledAllowances.length === 0 && enabledBonuses.length === 0) {
    return null;
  }

  return (
    <div
      className="job-detail-panel__hero-allowance-wrapper"
      aria-label="Características da classe"
    >
      <div className="job-detail-panel__hero-allowance-bar">
        {enabledAllowances.map(({ key, label, Icon }) => (
          <span
            key={key}
            title={label}
            aria-label={label}
            className="job-detail-panel__hero-allowance-chip"
          >
            <span className="job-detail-panel__hero-allowance-icon">
              <Icon />
            </span>

            <span className="job-detail-panel__hero-allowance-text">
              {label}
            </span>
          </span>
        ))}

        {enabledBonuses.map(({ key, label, shortLabel, Icon, value }) => (
          <span
            key={key}
            title={`${label}: +${value}`}
            aria-label={`${label}: +${value}`}
            className="job-detail-panel__hero-allowance-chip"
          >
            <span className="job-detail-panel__hero-allowance-icon">
              <Icon />
            </span>

            <span className="job-detail-panel__hero-allowance-text">
              +{value} {shortLabel}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}