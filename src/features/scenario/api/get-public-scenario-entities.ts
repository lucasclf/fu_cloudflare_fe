import { httpGet } from "../../../shared/lib/http-client";
import { API_BASE_URL } from "../../../shared/services/api";
import type { ScenarioEntity } from "../types/scenario";

export async function getPublicScenarioEntities(): Promise<ScenarioEntity[]> {
  return httpGet<ScenarioEntity[]>(`${API_BASE_URL}/public/scenario/entities`);
}