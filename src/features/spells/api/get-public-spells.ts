import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Spell } from "../types/spell";

export async function getPublicSpells(
  signal?: AbortSignal,
): Promise<Spell[]> {
  return httpGet<Spell[]>(`${API_BASE_URL}/public/spells`, { signal });
}
