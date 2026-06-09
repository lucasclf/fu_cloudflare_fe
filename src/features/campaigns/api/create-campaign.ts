import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateCampaignInput, CreatedCampaign } from "../types/campaign";

export async function createCampaign(input: CreateCampaignInput): Promise<CreatedCampaign> {
  return httpPost<CreatedCampaign>(`${API_BASE_URL}/campaigns`, input);
}
