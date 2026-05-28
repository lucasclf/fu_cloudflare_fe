import { API_BASE_URL } from "../services/api";
import { httpGet } from "./http-client";

export function createPublicListFetcher<T>(resource: string) {
  const normalizedResource = resource.replace(/^\/+|\/+$/g, "");

  return function fetchPublicList(signal?: AbortSignal): Promise<T[]> {
    return httpGet<T[]>(`${API_BASE_URL}/public/${normalizedResource}`, {
      signal,
    });
  };
}
