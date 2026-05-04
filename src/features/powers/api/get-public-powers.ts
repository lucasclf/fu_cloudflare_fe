import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Power } from "../types/power";

export async function getPublicPowers(): Promise<Power[]> {
  return httpGet<Power[]>(`${API_BASE_URL}/public/powers`);
}