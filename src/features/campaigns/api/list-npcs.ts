import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { NpcSummary } from "@/features/npcs/types/npc";

export async function listCampaignNpcs(campaignId: number, signal?: AbortSignal): Promise<NpcSummary[]> {
  return httpGet<NpcSummary[]>(`${API_BASE_URL}/campaigns/${campaignId}/npcs`, { signal });
}
