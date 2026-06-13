import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "@/shared/hooks/use-async-resource";
import { listCampaignSessions } from "../api/list-sessions";
import type { Session } from "../types/campaign";

export function useCampaignSessions(campaignId: number): AsyncResourceState<Session[]> {
  const loadSessions = useCallback(
    (signal: AbortSignal) => listCampaignSessions(campaignId, signal),
    [campaignId],
  );

  return useAsyncResource<Session[]>(loadSessions);
}
