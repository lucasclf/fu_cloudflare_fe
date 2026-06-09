import { httpDelete } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";

export async function deleteCampaign(campaignId: number): Promise<void> {
  await httpDelete(`${API_BASE_URL}/campaigns/${campaignId}`);
}
