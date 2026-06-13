import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { NpcSummary } from "../types/npc";

export async function getPublicNpcSummary(
  signal?: AbortSignal,
  globalOnly?: boolean,
): Promise<NpcSummary[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/npcs/summary?scope=global`
    : `${API_BASE_URL}/public/npcs/summary`;
  return httpGet<NpcSummary[]>(url, { signal });
}
