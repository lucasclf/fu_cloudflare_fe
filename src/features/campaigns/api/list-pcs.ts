import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { PcSummary } from "@/features/pcs/types/pc";

export async function listCampaignPcs(campaignId: number, signal?: AbortSignal): Promise<PcSummary[]> {
  return httpGet<PcSummary[]>(`${API_BASE_URL}/campaigns/${campaignId}/pcs`, { signal });
}
