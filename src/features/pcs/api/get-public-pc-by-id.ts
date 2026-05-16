import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { PcDetail } from "../types/pc";

export async function getPublicPcById(pcId: number): Promise<PcDetail> {
  return httpGet<PcDetail>(`${API_BASE_URL}/public/pcs/${pcId}`);
}