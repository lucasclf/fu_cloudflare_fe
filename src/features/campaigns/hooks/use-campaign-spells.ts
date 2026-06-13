import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignSpells } from "../api/list-spells";
import type { Spell } from "@/features/spells/types/spell";

export function useCampaignSpells(campaignId: number): AsyncResourceState<Spell[]> {
  const loadSpells = useCallback(
    (signal: AbortSignal) => listCampaignSpells(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<Spell[]>(loadSpells);
}
