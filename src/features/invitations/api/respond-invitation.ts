import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";

export async function acceptInvitation(invitationId: number): Promise<void> {
  await httpPost<{ message: string }>(`${API_BASE_URL}/invitations/${invitationId}/accept`, {});
}

export async function declineInvitation(invitationId: number): Promise<void> {
  await httpPost<{ message: string }>(`${API_BASE_URL}/invitations/${invitationId}/decline`, {});
}
