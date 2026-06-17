import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { UpdateItemInput } from "../types/campaign";

export async function updateItem(campaignId: number, itemId: number, input: UpdateItemInput): Promise<void> {
  await httpPatch<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/items/${itemId}`, input);
}
