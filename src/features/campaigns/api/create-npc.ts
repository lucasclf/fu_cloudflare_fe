import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateNpcInput } from "../types/campaign";

export async function createNpc(campaignId: number, input: CreateNpcInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/npcs`, input);
}
