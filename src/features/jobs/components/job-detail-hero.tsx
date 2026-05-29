import { DetailHero } from "@/shared/components/detail-hero";
import { EntityAvatar } from "@/shared/components/entity-avatar";
import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
} from "./job-feature-definitions";
import { JobFeatureChip } from "./job-feature-chip";
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
  const allowanceContent = <HeroAllowanceIcons job={job} />;

  return (
    <DetailHero
      badge={JOBS_CATALOG_CONFIG.copy.detail.entityBadge}
      title={job.name}
      subtitle={job.tagline}
      media={<EntityAvatar name={job.name} imageSrc={imageSrc} size="lg" />}
      aside={allowanceContent}
    />
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
      className="job-detail-panel__hero-allowance-bar"
      aria-label="Características da classe"
    >
      {enabledAllowances.map(({ key, label, Icon }) => (
        <JobFeatureChip key={key} Icon={Icon} label={label} variant="label">
          {label}
        </JobFeatureChip>
      ))}

      {enabledBonuses.map(({ key, label, shortLabel, Icon, value }) => (
        <JobFeatureChip
          key={key}
          Icon={Icon}
          label={label}
          variant="label"
          statusLabel={`+${value}`}
        >
          +{value} {shortLabel}
        </JobFeatureChip>
      ))}
    </div>
  );
}