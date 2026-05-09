import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { NpcSummary } from "../types/npc";

export async function getPublicNpcSummary(): Promise<NpcSummary[]> {
  return httpGet<NpcSummary[]>(`${API_BASE_URL}/public/npcs/summary`);
}