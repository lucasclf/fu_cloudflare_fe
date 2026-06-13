import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { PcSummary } from "../types/pc";

export async function getPublicPcSummary(
  signal?: AbortSignal,
  globalOnly?: boolean,
): Promise<PcSummary[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/pcs/summary?scope=global`
    : `${API_BASE_URL}/public/pcs/summary`;
  return httpGet<PcSummary[]>(url, { signal });
}
