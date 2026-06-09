import { createPublicListFetcher } from "@/shared/lib/create-public-list-fetcher";
import { mapItemDtosToItems } from "../lib/item-mapper";
import type { ItemDto } from "../types/item-dto";
import type { Item } from "../types/item";

const fetchPublicItemDtos = createPublicListFetcher<ItemDto>("items");

export async function getPublicItems(signal?: AbortSignal, globalOnly?: boolean): Promise<Item[]> {
  const params = globalOnly ? { scope: "global" } : undefined;
  const itemDtos = await fetchPublicItemDtos(signal, params);

  return mapItemDtosToItems(itemDtos);
}
