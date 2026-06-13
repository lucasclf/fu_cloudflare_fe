import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Spell } from "@/features/spells/types/spell";

export async function listCampaignSpells(campaignId: number, signal?: AbortSignal): Promise<Spell[]> {
  return httpGet<Spell[]>(`${API_BASE_URL}/campaigns/${campaignId}/spells`, { signal });
}
