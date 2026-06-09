import { useCallback } from "react";
import { useAsyncResource } from "@/shared/hooks/use-async-resource";
import type { AsyncResourceState } from "@/shared/hooks/use-async-resource";
import { getMyCampaigns } from "../api/get-my-campaigns";
import type { UserCampaign } from "../types/campaign";

export function useMyCampaigns(): AsyncResourceState<UserCampaign[]> {
  const loader = useCallback((signal: AbortSignal) => getMyCampaigns(signal), []);
  return useAsyncResource<UserCampaign[]>(loader);
}
