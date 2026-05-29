import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { PcSummary } from "../types/pc";

export async function getPublicPcSummary(
  signal?: AbortSignal,
): Promise<PcSummary[]> {
  return httpGet<PcSummary[]>(`${API_BASE_URL}/public/pcs/summary`, { signal });
}
