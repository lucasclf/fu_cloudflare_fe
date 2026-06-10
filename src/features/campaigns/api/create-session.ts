import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateSessionInput } from "../types/campaign";

export async function createSession(campaignId: number, input: CreateSessionInput): Promise<void> {
  await httpPost<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/sessions`, input);
}
