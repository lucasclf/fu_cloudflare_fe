import { useCallback } from "react";

import {
  type AsyncResourceByKeyState,
  useAsyncResourceByKey,
} from "../../../shared/hooks/use-async-resource-by-key";
import { getPublicPcById } from "../api/get-public-pc-by-id";
import { PCS_CATALOG_CONFIG } from "../config/pcs-catalog-config";
import type { PcDetail } from "../types/pc";

export function usePublicPcDetail(
  pcId: number | null,
): AsyncResourceByKeyState<PcDetail> {
  const loader = useCallback(
    (id: number, signal: AbortSignal) => getPublicPcById(id, signal),
    [],
  );

  const getErrorMessage = useCallback((error: unknown) => {
    return error instanceof Error
      ? error.message
      : PCS_CATALOG_CONFIG.copy.detail.errorMessage;
  }, []);

  return useAsyncResourceByKey({
    keyValue: pcId,
    loader,
    getErrorMessage,
  });
}
