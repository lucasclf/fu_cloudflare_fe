import { JobDetailArcanasSection } from "./job-detail-arcanas-section";
import { JobDetailBackgroundSection } from "./job-detail-background-section";
import { JobDetailHero } from "./job-detail-hero";
import { JobDetailPowersSection } from "./job-detail-powers-section";
import { JobDetailSpellsSection } from "./job-detail-spells-section";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { Job } from "../types/job";

import "./job-detail-panel.css";

type JobDetailPanelProps = {
  job: Job;
  loading: boolean;
  error: string | null;
};

export function JobDetailPanel({ job, loading, error }: JobDetailPanelProps) {
  return (
    <article className="job-detail-panel">
      <JobDetailHero job={job} />

      {loading ? (
        <p className="job-detail-panel__message">
          {JOBS_CATALOG_CONFIG.copy.detail.loadingMessage}
        </p>
      ) : null}

      {error ? <p className="job-detail-panel__message">{error}</p> : null}

      {!loading && !error ? (
        <>
          <JobDetailBackgroundSection job={job} />
          <JobDetailPowersSection powers={job.powers} />
          <JobDetailSpellsSection spells={job.spells} />
          <JobDetailArcanasSection arcanas={job.arcanas} />
        </>
      ) : null}
    </article>
  );
}