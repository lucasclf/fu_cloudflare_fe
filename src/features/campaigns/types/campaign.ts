export type CampaignRole = "master" | "player";

export type UserCampaignDto = {
  id: number;
  name: string;
  description: string | null;
  img_key: string | null;
  role: CampaignRole;
  joined_at: string;
};

export type UserCampaign = {
  id: number;
  name: string;
  description: string | null;
  imgKey: string | null;
  role: CampaignRole;
  joinedAt: string;
};

export type CreateCampaignInput = {
  name: string;
  description?: string | null;
};

export type CreatedCampaign = {
  id: number;
  message: string;
};
