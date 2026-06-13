import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "@/shared/hooks/use-async-resource";
import { getPublicScenarioEntities } from "../api/get-public-scenario-entities";
import type { ScenarioEntity } from "../types/scenario";

export function usePublicScenarioEntities(): AsyncResourceState<ScenarioEntity[]> {
  const loader = useCallback(() => {
    return getPublicScenarioEntities();
  }, []);

  return useAsyncResource<ScenarioEntity[]>(loader);
}
