import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignMonsters } from "../api/list-monsters";
import type { MonsterSummary } from "@/features/monsters/types/monster";

export function useCampaignMonsters(campaignId: number): AsyncResourceState<MonsterSummary[]> {
  const loadMonsters = useCallback(
    (signal: AbortSignal) => listCampaignMonsters(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<MonsterSummary[]>(loadMonsters);
}
