import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { MonsterSummary } from "../types/monster";

export async function getPublicMonsterSummary(): Promise<MonsterSummary[]> {
  return httpGet<MonsterSummary[]>(`${API_BASE_URL}/public/monsters/summary`);
}