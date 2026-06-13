import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignNpcs } from "../api/list-npcs";
import type { NpcSummary } from "@/features/npcs/types/npc";

export function useCampaignNpcs(campaignId: number): AsyncResourceState<NpcSummary[]> {
  const loadNpcs = useCallback(
    (signal: AbortSignal) => listCampaignNpcs(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<NpcSummary[]>(loadNpcs);
}
