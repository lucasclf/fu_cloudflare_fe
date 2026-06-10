import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateFactionInput } from "../types/campaign";

export async function createFaction(campaignId: number, input: CreateFactionInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/factions`, input);
}
