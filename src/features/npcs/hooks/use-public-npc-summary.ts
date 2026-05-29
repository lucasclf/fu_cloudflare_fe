import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "../../../shared/hooks/use-async-resource";
import { getPublicNpcSummary } from "../api/get-public-npc-summary";
import type { NpcSummary } from "../types/npc";

export function usePublicNpcSummary(): AsyncResourceState<NpcSummary[]> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicNpcSummary(signal);
  }, []);

  return useAsyncResource<NpcSummary[]>(loader);
}
