import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "@/shared/hooks/use-async-resource";
import { getPublicJobCatalog } from "../api/get-public-job-catalog";
import type { JobCatalogItem } from "../types/job";

export function usePublicJobCatalog(globalOnly: boolean): AsyncResourceState<JobCatalogItem[]> {
  const loadJobCatalog = useCallback((signal: AbortSignal) => {
    return getPublicJobCatalog(signal, globalOnly);
  }, [globalOnly]);

  return useAsyncResource<JobCatalogItem[]>(loadJobCatalog);
}
