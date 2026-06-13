import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignItems } from "../api/list-items";
import type { Item } from "@/features/items/types/item";

export function useCampaignItems(campaignId: number): AsyncResourceState<Item[]> {
  const loadItems = useCallback(
    (signal: AbortSignal) => listCampaignItems(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<Item[]>(loadItems);
}
