import { createPublicListFetcher } from "@/shared/lib/create-public-list-fetcher";
import { mapJobCatalogItemDtosToJobCatalogItems } from "../lib/job-catalog-mapper";
import type { JobCatalogItemDto } from "../types/job-dto";
import type { JobCatalogItem } from "../types/job";

const fetchPublicJobCatalogDtos =
  createPublicListFetcher<JobCatalogItemDto>("jobs/catalog");

export async function getPublicJobCatalog(
  signal?: AbortSignal,
): Promise<JobCatalogItem[]> {
  const dtos = await fetchPublicJobCatalogDtos(signal);

  return mapJobCatalogItemDtosToJobCatalogItems(dtos);
}