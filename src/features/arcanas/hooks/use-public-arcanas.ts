import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "@/shared/hooks/use-async-resource";
import { getPublicArcanas } from "../api/get-public-arcanas";
import type { Arcana } from "../types/arcana";

export function usePublicArcanas(globalOnly: boolean): AsyncResourceState<Arcana[]> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicArcanas(signal, globalOnly);
  }, [globalOnly]);

  return useAsyncResource<Arcana[]>(loader);
}
