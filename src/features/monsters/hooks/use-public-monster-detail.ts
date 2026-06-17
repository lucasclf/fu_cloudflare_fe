import { useCallback } from "react";

import {
  type AsyncResourceByKeyState,
  useAsyncResourceByKey,
} from "../../../shared/hooks/use-async-resource-by-key";
import { getPublicMonsterById } from "../api/get-public-monster-by-id";
import { MONSTERS_CATALOG_CONFIG } from "../config/monsters-catalog-config";
import type { MonsterDetail } from "../types/monster";

export function usePublicMonsterDetail(
  monsterId: number | null,
  reloadTrigger = 0,
): AsyncResourceByKeyState<MonsterDetail> {
  const loader = useCallback(
    (id: number, signal: AbortSignal) => getPublicMonsterById(id, signal),
    [],
  );

  const getErrorMessage = useCallback((error: unknown) => {
    return error instanceof Error
      ? error.message
      : MONSTERS_CATALOG_CONFIG.copy.detail.errorMessage;
  }, []);

  return useAsyncResourceByKey({
    keyValue: monsterId,
    loader,
    getErrorMessage,
    reloadTrigger,
  });
}
