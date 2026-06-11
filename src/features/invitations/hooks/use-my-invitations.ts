import { useAsyncResource } from "@/shared/hooks/use-async-resource";
import { getMyInvitations } from "../api/get-my-invitations";
import type { InvitationSummary } from "../types/invitation";

export function useMyInvitations() {
  return useAsyncResource<InvitationSummary[]>(getMyInvitations);
}
