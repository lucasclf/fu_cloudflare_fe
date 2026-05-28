import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Job } from "../types/job";

const JOB_DETAIL_INCLUDES = "background,powers,spells";

export function getPublicJobById(
  jobId: number,
  signal?: AbortSignal,
): Promise<Job> {
  return httpGet<Job>(
    `${API_BASE_URL}/public/jobs/${jobId}?include=${JOB_DETAIL_INCLUDES}`,
    {
      signal,
    },
  );
}