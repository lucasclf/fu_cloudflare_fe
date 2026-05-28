import { useCallback } from "react";

import {
  type AsyncResourceState,
  useAsyncResource,
} from "@/shared/hooks/use-async-resource";
import { getPublicSessions } from "../api/get-public-sessions";
import type { Session } from "../types/session";

export function usePublicSessions(): AsyncResourceState<Session[]> {
  const loadSessions = useCallback((signal: AbortSignal) => {
    return getPublicSessions(signal);
  }, []);

  return useAsyncResource<Session[]>(loadSessions);
}
