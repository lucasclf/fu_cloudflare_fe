import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateFactionInput } from "../types/campaign";

export async function updateFaction(campaignId: number, factionId: number, input: CreateFactionInput): Promise<void> {
  await httpPatch<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/factions/${factionId}`, input);
}
