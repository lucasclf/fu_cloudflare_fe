import { API_BASE_URL } from "../services/api";
import { httpGet } from "./http-client";

export function createPublicListFetcher<T>(resource: string) {
  const normalizedResource = resource.replace(/^\/+|\/+$/g, "");

  return function fetchPublicList(signal?: AbortSignal, params?: Record<string, string>): Promise<T[]> {
    let url = `${API_BASE_URL}/public/${normalizedResource}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${new URLSearchParams(params).toString()}`;
    }
    return httpGet<T[]>(url, { signal });
  };
}
