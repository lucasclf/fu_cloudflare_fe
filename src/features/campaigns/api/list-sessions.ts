import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Session } from "../types/campaign";

export async function listCampaignSessions(campaignId: number, signal?: AbortSignal): Promise<Session[]> {
  return httpGet<Session[]>(`${API_BASE_URL}/campaigns/${campaignId}/sessions`, { signal });
}
