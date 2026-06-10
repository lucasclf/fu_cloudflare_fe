import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreatePcInput } from "../types/campaign";

export async function createPc(campaignId: number, input: CreatePcInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/pcs`, input);
}
