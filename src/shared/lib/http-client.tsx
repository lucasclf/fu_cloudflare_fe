import type { ApiResponse } from "../types/api";

export async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(url);

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    const message =
      "error" in body ? body.error.message : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  if (!body.success) {
    throw new Error(body.error.message);
  }

  return body.data;
}