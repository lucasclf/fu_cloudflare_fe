import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { MonsterSummary } from "@/features/monsters/types/monster";

export async function listCampaignMonsters(campaignId: number, signal?: AbortSignal): Promise<MonsterSummary[]> {
  return httpGet<MonsterSummary[]>(`${API_BASE_URL}/campaigns/${campaignId}/monsters`, { signal });
}
