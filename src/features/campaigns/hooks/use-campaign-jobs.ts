import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignJobs } from "../api/list-jobs";
import type { JobCatalogItem } from "@/features/jobs/types/job";

export function useCampaignJobs(campaignId: number): AsyncResourceState<JobCatalogItem[]> {
  const loadJobs = useCallback(
    (signal: AbortSignal) => listCampaignJobs(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<JobCatalogItem[]>(loadJobs);
}
