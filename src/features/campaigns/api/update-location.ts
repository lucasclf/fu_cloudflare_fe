import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateLocationInput } from "../types/campaign";

export async function updateLocation(campaignId: number, locationId: number, input: CreateLocationInput): Promise<void> {
  await httpPatch<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/locations/${locationId}`, input);
}
