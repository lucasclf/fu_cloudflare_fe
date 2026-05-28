import { createPublicListFetcher } from "@/shared/lib/create-public-list-fetcher";
import type { JobCatalogItem } from "../types/job";

export const getPublicJobCatalog =
  createPublicListFetcher<JobCatalogItem>("jobs/catalog");