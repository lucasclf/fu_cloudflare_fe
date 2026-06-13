import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Power } from "@/features/powers/types/power";

export async function listCampaignPowers(campaignId: number, signal?: AbortSignal): Promise<Power[]> {
  return httpGet<Power[]>(`${API_BASE_URL}/campaigns/${campaignId}/powers`, { signal });
}
