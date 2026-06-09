import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "../../../shared/hooks/use-async-resource";
import { getPublicMonsterSummary } from "../api/get-public-monster-summary";
import type { MonsterSummary } from "../types/monster";

export function usePublicMonsterSummary(globalOnly: boolean): AsyncResourceState<
  MonsterSummary[]
> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicMonsterSummary(signal, globalOnly);
  }, [globalOnly]);

  return useAsyncResource<MonsterSummary[]>(loader);
}
