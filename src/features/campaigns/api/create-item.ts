import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateItemInput } from "../types/campaign";

export async function createItem(campaignId: number, input: CreateItemInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/items`, input);
}
