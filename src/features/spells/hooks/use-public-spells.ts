import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "../../../shared/hooks/use-async-resource";
import { getPublicSpells } from "../api/get-public-spells";
import type { Spell } from "../types/spell";

export function usePublicSpells(): AsyncResourceState<Spell[]> {
  const loader = useCallback((signal: AbortSignal) => {
    return getPublicSpells(signal);
  }, []);

  return useAsyncResource<Spell[]>(loader);
}
