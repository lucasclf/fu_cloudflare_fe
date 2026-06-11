import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { LocationOption } from "../types/campaign";

export async function listLocations(campaignId: number): Promise<LocationOption[]> {
  return httpGet<LocationOption[]>(`${API_BASE_URL}/campaigns/${campaignId}/locations`);
}
