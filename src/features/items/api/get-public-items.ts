import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { Item } from "../types/item";

export async function getPublicItems(): Promise<Item[]> {
  return httpGet<Item[]>(`${API_BASE_URL}/public/items`);
}