import { useCallback } from "react";
import { useAsyncResource } from "@/shared/hooks/use-async-resource";
import { getCampaignHome } from "../api/get-campaign-home";
import type { CampaignHome } from "../types/campaign";

export function useCampaignHome(campaignId: number) {
  const loader = useCallback(
    (signal: AbortSignal) => getCampaignHome(campaignId, signal),
    [campaignId],
  );
  return useAsyncResource<CampaignHome>(loader);
}
