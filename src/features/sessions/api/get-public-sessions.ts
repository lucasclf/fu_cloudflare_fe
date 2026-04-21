import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Session } from "../types/session";

export async function getPublicSessions(): Promise<Session[]> {
  return httpGet<Session[]>(`${API_BASE_URL}/public/sessions`);
}