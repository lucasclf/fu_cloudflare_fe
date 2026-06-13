import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import {
  listCampaignFactionsAsScenarioEntities,
  listCampaignLocationsAsScenarioEntities,
} from "../api/list-scenario-entities";
import type { ScenarioEntity } from "@/features/scenario/types/scenario";

export function useCampaignScenarioEntities(campaignId: number): AsyncResourceState<ScenarioEntity[]> {
  const loadEntities = useCallback(async (signal: AbortSignal) => {
    const [locations, factions] = await Promise.all([
      listCampaignLocationsAsScenarioEntities(campaignId, signal),
      listCampaignFactionsAsScenarioEntities(campaignId, signal),
    ]);

    return [...locations, ...factions];
  }, [campaignId]);

  return useAsyncResource<ScenarioEntity[]>(loadEntities);
}
