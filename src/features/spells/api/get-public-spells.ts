import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Spell } from "../types/spell";

export async function getPublicSpells(signal?: AbortSignal, globalOnly?: boolean): Promise<Spell[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/spells?scope=global`
    : `${API_BASE_URL}/public/spells`;
  return httpGet<Spell[]>(url, { signal });
}
