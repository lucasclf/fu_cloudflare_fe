import { Badge } from "@/shared/components/badge";
import { ContentCard } from "@/shared/components/content-card";
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
          <ContentCard key={power.id} variant="surface">
            <div className="job-detail-panel__card-header">
              <h4 className="job-detail-panel__card-title">{power.name}</h4>

              <div className="job-detail-panel__inline-badges">
                {power.type ? (
                  <Badge variant="surface">
                    {renderTokenLabel(power.type)}
                  </Badge>
                ) : null}

                {power.maxLevel ? (
                  <Badge variant="surface">
                    {JOBS_CATALOG_CONFIG.copy.detail.powers.maxLevelLabel}{" "}
                    {power.maxLevel}
                  </Badge>
                ) : null}

                {power.isGlobal ? (
                  <Badge variant="surface">
                    {JOBS_CATALOG_CONFIG.copy.detail.powers.globalLabel}
                  </Badge>
                ) : null}
              </div>
            </div>

            <p className="job-detail-panel__text">{power.description}</p>
          </ContentCard>
        ))}
      </div>
    </JobDetailSection>
  );
}
