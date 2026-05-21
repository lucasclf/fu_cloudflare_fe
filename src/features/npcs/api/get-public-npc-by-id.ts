import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { NpcDetail } from "../types/npc";

export async function getPublicNpcById(npcId: number): Promise<NpcDetail> {
  return httpGet<NpcDetail>(
    `${API_BASE_URL}/public/npcs/${npcId}?include=rules,inventories,equipments`,
  );
}