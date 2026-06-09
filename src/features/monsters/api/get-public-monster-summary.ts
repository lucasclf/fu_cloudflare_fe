import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { MonsterSummary } from "../types/monster";

export async function getPublicMonsterSummary(
  signal?: AbortSignal,
  globalOnly?: boolean,
): Promise<MonsterSummary[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/monsters/summary?scope=global`
    : `${API_BASE_URL}/public/monsters/summary`;
  return httpGet<MonsterSummary[]>(url, { signal });
}
