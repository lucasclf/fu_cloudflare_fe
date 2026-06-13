import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignPcs } from "../api/list-pcs";
import type { PcSummary } from "@/features/pcs/types/pc";

export function useCampaignPcs(campaignId: number): AsyncResourceState<PcSummary[]> {
  const loadPcs = useCallback(
    (signal: AbortSignal) => listCampaignPcs(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<PcSummary[]>(loadPcs);
}
