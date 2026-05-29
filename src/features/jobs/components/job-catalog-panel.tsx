import { CatalogCardGrid } from "@/features/catalog/components/catalog-card-grid";
import { CatalogEmptyMessage } from "@/features/catalog/components/catalog-empty-message";
import { ActionCard } from "@/shared/components/action-card";
import { EntityAvatar } from "@/shared/components/entity-avatar";
import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
} from "./job-feature-definitions";
import { JobFeatureChip } from "./job-feature-chip";
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

export function JobCatalogPanel({ jobs, onSelect }: JobCatalogPanelProps) {
  if (jobs.length === 0) {
    return (
      <CatalogEmptyMessage>Nenhuma classe para exibir.</CatalogEmptyMessage>
    );
  }

  return (
    <CatalogCardGrid className="job-catalog-panel">
      {jobs.map((job) => {
        const imageSrc = getJobImageSrc(job.imageKey);

        return (
          <ActionCard
            key={job.id}
            className="job-catalog-panel__card"
            ariaLabel={`Ver detalhes da classe ${job.name}`}
            onClick={() => onSelect(job.id)}
          >
            <EntityAvatar name={job.name} imageSrc={imageSrc} size="md" />

            <h2 className="job-catalog-panel__title">{job.name}</h2>

            {job.tagline ? (
              <p className="job-catalog-panel__tagline">{job.tagline}</p>
            ) : null}

            <JobAllowanceIcons job={job} />
          </ActionCard>
        );
      })}
    </CatalogCardGrid>
  );
}

function JobAllowanceIcons({ job }: { job: JobCatalogItem }) {
  return (
    <div
      className="job-catalog-panel__allowance-bar"
      aria-label="Características da classe"
    >
      {ALLOWANCE_DEFINITIONS.map(({ key, label, Icon }) => {
        const enabled = isJobAllowanceEnabled(job[key]);

        return (
          <JobFeatureChip
            key={key}
            Icon={Icon}
            label={label}
            active={enabled}
            statusLabel={enabled ? "permitido" : "não permitido"}
          />
        );
      })}

      {BONUS_DEFINITIONS.map(({ key, label, shortLabel, Icon }) => {
        const value = getPositiveJobBonus(job[key]);
        const enabled = value > 0;

        return (
          <JobFeatureChip
            key={key}
            Icon={Icon}
            label={label}
            active={enabled}
            statusLabel={enabled ? `+${value} ${shortLabel}` : "sem bônus"}
          >
            {enabled ? `+${value}` : null}
          </JobFeatureChip>
        );
      })}
    </div>
  );
}
