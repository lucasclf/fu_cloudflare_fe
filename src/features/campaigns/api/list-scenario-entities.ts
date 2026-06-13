import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { ScenarioEntity, ScenarioLocationRelation } from "@/features/scenario/types/scenario";

type CampaignLocationDto = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  img_key: string | null;
  location_type: string;
};

type CampaignFactionDto = {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  img_key: string | null;
  faction_type: string;
  location_relations: ScenarioLocationRelation[];
};

export async function listCampaignLocationsAsScenarioEntities(campaignId: number, signal?: AbortSignal): Promise<ScenarioEntity[]> {
  const dtos = await httpGet<CampaignLocationDto[]>(`${API_BASE_URL}/campaigns/${campaignId}/locations`, { signal });
  return dtos.map((dto) => ({
    uid: `location-${dto.id}`,
    id: dto.id,
    type: "location" as const,
    name: dto.name,
    tagline: dto.tagline,
    description: dto.description,
    img_key: dto.img_key,
    subtype: dto.location_type,
  }));
}

export async function listCampaignFactionsAsScenarioEntities(campaignId: number, signal?: AbortSignal): Promise<ScenarioEntity[]> {
  const dtos = await httpGet<CampaignFactionDto[]>(`${API_BASE_URL}/campaigns/${campaignId}/factions`, { signal });
  return dtos.map((dto) => ({
    uid: `faction-${dto.id}`,
    id: dto.id,
    type: "faction" as const,
    name: dto.name,
    tagline: dto.tagline,
    description: dto.description,
    img_key: dto.img_key,
    subtype: dto.faction_type,
    location_relations: dto.location_relations,
  }));
}
