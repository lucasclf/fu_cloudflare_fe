import { httpGet } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";
import type { Arcana } from "../types/arcana";

export async function getPublicArcanas(signal?: AbortSignal, globalOnly?: boolean): Promise<Arcana[]> {
  const url = globalOnly
    ? `${API_BASE_URL}/public/arcanas?scope=global`
    : `${API_BASE_URL}/public/arcanas`;
  return httpGet<Arcana[]>(url, { signal });
}
