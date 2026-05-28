import { createPublicListFetcher } from "@/shared/lib/create-public-list-fetcher";
import { mapItemDtosToItems } from "../lib/item-mapper";
import type { ItemDto } from "../types/item-dto";
import type { Item } from "../types/item";

const fetchPublicItemDtos = createPublicListFetcher<ItemDto>("items");

export async function getPublicItems(signal?: AbortSignal): Promise<Item[]> {
  const itemDtos = await fetchPublicItemDtos(signal);

  return mapItemDtosToItems(itemDtos);
}
