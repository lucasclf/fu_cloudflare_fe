export type InvitationStatus = "pending" | "accepted" | "declined" | "cancelled";

export type InvitationSummary = {
  id: number;
  status: InvitationStatus;
  campaign_id: number;
  campaign_name: string;
  inviter_name: string;
  inviter_nickname: string;
  created_at: string;
};
