import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { JobCatalogItem } from "../types/job";

export async function getPublicJobCatalog(): Promise<JobCatalogItem[]> {
  return httpGet<JobCatalogItem[]>(`${API_BASE_URL}/public/jobs/catalog`);
}
