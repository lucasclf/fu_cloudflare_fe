import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateMonsterInput } from "../types/campaign";

export async function createMonster(campaignId: number, input: CreateMonsterInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/monsters`, input);
}
