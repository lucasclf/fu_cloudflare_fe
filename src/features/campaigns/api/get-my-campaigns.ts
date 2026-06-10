import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { UserCampaign, UserCampaignDto } from "../types/campaign";

function mapDto(dto: UserCampaignDto): UserCampaign {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    imgKey: dto.img_key,
    status: dto.status,
    role: dto.role,
    joinedAt: dto.joined_at,
  };
}

export async function getMyCampaigns(signal?: AbortSignal): Promise<UserCampaign[]> {
  const dtos = await httpGet<UserCampaignDto[]>(`${API_BASE_URL}/campaigns`, { signal });
  return dtos.map(mapDto);
}
