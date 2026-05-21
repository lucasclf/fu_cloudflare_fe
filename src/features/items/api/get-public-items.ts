import { createPublicListFetcher } from "../../../shared/lib/create-public-list-fetcher";
import type { Item } from "../types/item";

export const getPublicItems = createPublicListFetcher<Item>("items");