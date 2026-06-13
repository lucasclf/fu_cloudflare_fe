import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import { mapItemDtosToItems } from "@/features/items/lib/item-mapper";
import type { ItemDto } from "@/features/items/types/item-dto";
import type { Item } from "@/features/items/types/item";

export async function listCampaignItems(campaignId: number, signal?: AbortSignal): Promise<Item[]> {
  const dtos = await httpGet<ItemDto[]>(`${API_BASE_URL}/campaigns/${campaignId}/items`, { signal });
  return mapItemDtosToItems(dtos);
}
