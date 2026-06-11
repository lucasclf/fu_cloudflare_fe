import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { InvitationSummary } from "../types/invitation";

export async function getMyInvitations(signal?: AbortSignal): Promise<InvitationSummary[]> {
  return httpGet<InvitationSummary[]>(`${API_BASE_URL}/invitations`, { signal });
}
