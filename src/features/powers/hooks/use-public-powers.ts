import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "../../../shared/hooks/use-async-resource";
import { getPublicPowers } from "../api/get-public-powers";
import type { Power } from "../types/power";

export function usePublicPowers(globalOnly: boolean): AsyncResourceState<Power[]> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicPowers(signal, globalOnly);
  }, [globalOnly]);

  return useAsyncResource<Power[]>(loader);
}
