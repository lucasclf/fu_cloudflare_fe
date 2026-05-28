import { JobDetailSection } from "./job-detail-section";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import { hasItems } from "../lib/job-detail-formatters";
import { renderTokenLabel } from "../lib/job-formatters";
import type { JobPower } from "../types/job";

type JobDetailPowersSectionProps = {
  powers: JobPower[] | undefined;
};

export function JobDetailPowersSection({
  powers,
}: JobDetailPowersSectionProps) {
  if (!hasItems(powers)) {
    return null;
  }

  return (
    <JobDetailSection
      title={JOBS_CATALOG_CONFIG.copy.detail.sections.powers}
      count={powers.length}
    >
      <div className="job-detail-panel__list">
        {powers.map((power) => (
          <div key={power.id} className="job-detail-panel__info-box">
            <div className="job-detail-panel__card-header">
              <h4 className="job-detail-panel__card-title">{power.name}</h4>

              <div className="job-detail-panel__inline-badges">
                {power.type ? (
                  <span className="job-detail-panel__secondary-badge">
                    {renderTokenLabel(power.type)}
                  </span>
                ) : null}

                {power.maxLevel ? (
                  <span className="job-detail-panel__secondary-badge">
                    {JOBS_CATALOG_CONFIG.copy.detail.powers.maxLevelLabel}{" "}
                    {power.maxLevel}
                  </span>
                ) : null}

                {power.isGlobal ? (
                  <span className="job-detail-panel__secondary-badge">
                    {JOBS_CATALOG_CONFIG.copy.detail.powers.globalLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <p className="job-detail-panel__text">{power.description}</p>
          </div>
        ))}
      </div>
    </JobDetailSection>
  );
}