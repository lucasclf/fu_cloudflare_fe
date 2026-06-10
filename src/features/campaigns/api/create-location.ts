import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateLocationInput } from "../types/campaign";

export async function createLocation(campaignId: number, input: CreateLocationInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/locations`, input);
}
