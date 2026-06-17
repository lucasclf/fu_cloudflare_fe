import { httpPut } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreatePcInput } from "../types/campaign";

export async function updatePc(campaignId: number, pcId: number, input: CreatePcInput): Promise<void> {
  await httpPut<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/pcs/${pcId}`, input);
}
