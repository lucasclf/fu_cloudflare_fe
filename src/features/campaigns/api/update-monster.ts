import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { CreateMonsterInput } from "../types/campaign";

export async function updateMonster(
  campaignId: number,
  monsterId: number,
  input: CreateMonsterInput,
): Promise<void> {
  await httpPatch<unknown>(
    `${API_BASE_URL}/campaigns/${campaignId}/monsters/${monsterId}`,
    input,
  );
}
