import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import { mapJobCatalogItemDtosToJobCatalogItems } from "@/features/jobs/lib/job-catalog-mapper";
import type { JobCatalogItemDto } from "@/features/jobs/types/job-dto";
import type { JobCatalogItem } from "@/features/jobs/types/job";

export async function listCampaignJobs(campaignId: number, signal?: AbortSignal): Promise<JobCatalogItem[]> {
  const dtos = await httpGet<JobCatalogItemDto[]>(`${API_BASE_URL}/campaigns/${campaignId}/jobs`, { signal });
  return mapJobCatalogItemDtosToJobCatalogItems(dtos);
}
