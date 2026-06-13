import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignArcanas } from "../api/list-arcanas";
import type { Arcana } from "@/features/arcanas/types/arcana";

export function useCampaignArcanas(campaignId: number): AsyncResourceState<Arcana[]> {
  const loadArcanas = useCallback(
    (signal: AbortSignal) => listCampaignArcanas(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<Arcana[]>(loadArcanas);
}
