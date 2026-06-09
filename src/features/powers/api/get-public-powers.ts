import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Power } from "../types/power";

export async function getPublicPowers(signal?: AbortSignal, globalOnly?: boolean): Promise<Power[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/powers?scope=global`
    : `${API_BASE_URL}/public/powers`;
  return httpGet<Power[]>(url, { signal });
}
