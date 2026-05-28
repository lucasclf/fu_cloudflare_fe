import { normalizeText } from "./job-formatters";
import {
  type JobFeatureFilterKey,
  jobMatchesFeatureFilter,
} from "./job-feature-filters";
import type { JobCatalogItem } from "../types/job";

type FilterJobsParams = {
  jobs: readonly JobCatalogItem[];
  search: string;
  selectedFeatureKeys: readonly JobFeatureFilterKey[];
};

export function filterJobs({
  jobs,
  search,
  selectedFeatureKeys,
}: FilterJobsParams): JobCatalogItem[] {
  const query = normalizeText(search);

  return jobs.filter((job) => {
    const name = normalizeText(job.name);
    const tagline = normalizeText(job.tagline ?? "");

    const matchesSearch =
      query.length === 0 || name.includes(query) || tagline.includes(query);

    const matchesFeatures = selectedFeatureKeys.every((key) =>
      jobMatchesFeatureFilter(job, key),
    );

    return matchesSearch && matchesFeatures;
  });
}
