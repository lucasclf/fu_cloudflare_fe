import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { UserSearchResult } from "../types/campaign";

export async function searchUsers(
  query: string,
  campaignId: number,
  signal?: AbortSignal,
): Promise<UserSearchResult[]> {
  const params = new URLSearchParams({ q: query, campaignId: String(campaignId) });
  return httpGet<UserSearchResult[]>(`${API_BASE_URL}/users/search?${params}`, { signal });
}
