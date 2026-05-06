import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { MonsterDetail } from "../types/monster";

export async function getPublicMonsterById(
  monsterId: number,
): Promise<MonsterDetail> {
  return httpGet<MonsterDetail>(
    `${API_BASE_URL}/public/monsters/${monsterId}?include=traits,affinities,actions`,
  );
}