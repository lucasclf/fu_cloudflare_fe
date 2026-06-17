import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateNpcInput } from "../types/campaign";

export async function updateNpc(campaignId: number, npcId: number, input: CreateNpcInput): Promise<void> {
  await httpPatch<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/npcs/${npcId}`, input);
}
