import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignPowers } from "../api/list-powers";
import type { Power } from "@/features/powers/types/power";

export function useCampaignPowers(campaignId: number): AsyncResourceState<Power[]> {
  const loadPowers = useCallback(
    (signal: AbortSignal) => listCampaignPowers(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<Power[]>(loadPowers);
}
