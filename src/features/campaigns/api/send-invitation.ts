import { httpPost } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";

export async function sendInvitation(
  campaignId: number,
  inviteeNickname: string,
  signal?: AbortSignal,
): Promise<void> {
  await httpPost<{ message: string }>(
    `${API_BASE_URL}/campaigns/${campaignId}/invitations`,
    { invitee_nickname: inviteeNickname },
    { signal },
  );
}
