import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Arcana } from "@/features/arcanas/types/arcana";

export async function listCampaignArcanas(campaignId: number, signal?: AbortSignal): Promise<Arcana[]> {
  return httpGet<Arcana[]>(`${API_BASE_URL}/campaigns/${campaignId}/arcanas`, { signal });
}
