import { useCallback } from "react";

import {
  useAsyncResource,
  type AsyncResourceState,
} from "../../../shared/hooks/use-async-resource";
import { getPublicItems } from "../api/get-public-items";
import type { Item } from "../types/item";

export function usePublicItems(): AsyncResourceState<Item[]> {
  const loadItems = useCallback((signal: AbortSignal) => {
    return getPublicItems(signal);
  }, []);

  return useAsyncResource<Item[]>(loadItems);
}