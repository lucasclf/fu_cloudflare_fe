import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import { mapJobDtoToJob } from "../lib/job-detail-mapper";
import type { Job } from "../types/job";
import type { JobDto } from "../types/job-dto";

const JOB_DETAIL_INCLUDES = "background,powers,spells";

export async function getPublicJobById(
  jobId: number,
  signal?: AbortSignal,
): Promise<Job> {
  const dto = await httpGet<JobDto>(
    `${API_BASE_URL}/public/jobs/${jobId}?include=${JOB_DETAIL_INCLUDES}`,
    {
      signal,
    },
  );

  return mapJobDtoToJob(dto);
}
