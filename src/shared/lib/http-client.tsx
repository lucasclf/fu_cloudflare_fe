import type { ApiResponse } from "../types/api";

export async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    if ("error" in body) {
      throw new Error(body.error.message);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!body.success) {
    throw new Error(body.error.message);
  }

  return body.data;
}