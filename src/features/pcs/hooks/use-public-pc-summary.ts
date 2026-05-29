import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "../../../shared/hooks/use-async-resource";
import { getPublicPcSummary } from "../api/get-public-pc-summary";
import type { PcSummary } from "../types/pc";

export function usePublicPcSummary(): AsyncResourceState<PcSummary[]> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicPcSummary(signal);
  }, []);

  return useAsyncResource<PcSummary[]>(loader);
}
