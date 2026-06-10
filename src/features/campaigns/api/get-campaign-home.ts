import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CampaignHome } from "../types/campaign";

export async function getCampaignHome(
  campaignId: number,
  signal?: AbortSignal,
): Promise<CampaignHome> {
  return httpGet<CampaignHome>(`${API_BASE_URL}/campaigns/${campaignId}/home`, { signal });
}
