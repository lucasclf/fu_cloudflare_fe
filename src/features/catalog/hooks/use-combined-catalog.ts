import { useCallback, useMemo } from "react";

import type { AsyncResourceState } from "@/shared/hooks/use-async-resource";

export function useCombinedCatalog<T>(
  global: AsyncResourceState<T[]>,
  campaign: AsyncResourceState<T[]>,
): AsyncResourceState<T[]> {
  const data = useMemo(
    () => [...(global.data ?? []), ...(campaign.data ?? [])],
    [global.data, campaign.data],
  );

  const reload = useCallback(() => {
    global.reload();
    campaign.reload();
  }, [global, campaign]);

  return {
    data,
    loading: global.loading || campaign.loading,
    error: global.error ?? campaign.error,
    reload,
  };
}

function noop() {}

export function useEmptyResource<T>(): AsyncResourceState<T[]> {
  return { data: [], loading: false, error: null, reload: noop };
}
