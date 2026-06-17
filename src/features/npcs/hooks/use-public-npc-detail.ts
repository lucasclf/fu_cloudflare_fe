import { useCallback } from "react";

import {
  type AsyncResourceByKeyState,
  useAsyncResourceByKey,
} from "../../../shared/hooks/use-async-resource-by-key";
import { getPublicNpcById } from "../api/get-public-npc-by-id";
import { NPCS_CATALOG_CONFIG } from "../config/npcs-catalog-config";
import type { NpcDetail } from "../types/npc";

export function usePublicNpcDetail(
  npcId: number | null,
  reloadTrigger = 0,
): AsyncResourceByKeyState<NpcDetail> {
  const loader = useCallback(
    (id: number, signal: AbortSignal) => getPublicNpcById(id, signal),
    [],
  );

  const getErrorMessage = useCallback((error: unknown) => {
    return error instanceof Error
      ? error.message
      : NPCS_CATALOG_CONFIG.copy.detail.errorMessage;
  }, []);

  return useAsyncResourceByKey({
    keyValue: npcId,
    loader,
    getErrorMessage,
    reloadTrigger,
  });
}
