import { Badge } from "@/shared/components/badge";
import { ContentCard } from "@/shared/components/content-card";
import { JobDetailSection } from "./job-detail-section";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import {
  getArcanaDetails,
  getArcanaDomains,
  hasItems,
} from "../lib/job-detail-formatters";
import type { JobArcana } from "../types/job";

type JobDetailArcanasSectionProps = {
  arcanas: JobArcana[] | undefined;
};

export function JobDetailArcanasSection({
  arcanas,
}: JobDetailArcanasSectionProps) {
  if (!hasItems(arcanas)) {
    return null;
  }

  return (
    <JobDetailSection
      title={JOBS_CATALOG_CONFIG.copy.detail.sections.arcanas}
      count={arcanas.length}
      defaultOpen={false}
    >
      <div className="job-detail-panel__arcana-grid">
        {arcanas.map((arcana) => (
          <ArcanaCard key={arcana.id} arcana={arcana} />
        ))}
      </div>
    </JobDetailSection>
  );
}

function ArcanaCard({ arcana }: { arcana: JobArcana }) {
  const details = getArcanaDetails(arcana);

  return (
    <ContentCard
      as="article"
      variant="elevated"
      className="job-detail-panel__arcana-card"
    >
      <header className="job-detail-panel__arcana-header">
        <h3 className="job-detail-panel__arcana-title">{arcana.name}</h3>

        <div className="job-detail-panel__arcana-domain-list">
          {getArcanaDomains(arcana.domain).map((domain) => (
            <Badge key={domain} variant="accent">
              {domain}
            </Badge>
          ))}
        </div>
      </header>

      {details.length > 0 ? (
        <div className="job-detail-panel__arcana-details">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="job-detail-panel__arcana-detail-block"
            >
              <div className="job-detail-panel__arcana-detail-label">
                {detail.label}
              </div>

              <p className="job-detail-panel__arcana-detail-text">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </ContentCard>
  );
}