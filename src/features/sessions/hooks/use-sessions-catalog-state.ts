import { useCallback, useMemo, useState } from "react";

import {
  extractSessionNumberFromSearch,
  filterSessions,
} from "../lib/filter-sessions";
import { getSessionNumberLabel } from "../lib/session-formatters";
import type { Session } from "../types/session";

type UseSessionsCatalogStateParams = {
  sessions: readonly Session[];
};

type UseSessionsCatalogStateResult = {
  search: string;
  selectedSessionId: number | null;
  selectedSession: Session | null;
  filteredSessions: Session[];
  sessionsToRender: Session[];
  hasActiveFilters: boolean;
  setSearch: (value: string) => void;
  selectSession: (sessionId: number) => void;
  clearSelection: () => void;
};

export function useSessionsCatalogState({
  sessions,
}: UseSessionsCatalogStateParams): UseSessionsCatalogStateResult {
  const [search, setRawSearch] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );

  const filteredSessions = useMemo(() => {
    return filterSessions({
      sessions,
      search,
    });
  }, [sessions, search]);

  const selectedSession = useMemo(() => {
    if (selectedSessionId !== null) {
      return (
        sessions.find((session) => session.id === selectedSessionId) ?? null
      );
    }

    const extractedSessionNumber = extractSessionNumberFromSearch(search);

    if (extractedSessionNumber === null) {
      return null;
    }

    return (
      sessions.find(
        (session) => session.sessionNumber === extractedSessionNumber,
      ) ?? null
    );
  }, [sessions, search, selectedSessionId]);

  const sessionsToRender = useMemo(() => {
    return selectedSession ? [selectedSession] : filteredSessions;
  }, [filteredSessions, selectedSession]);

  const hasActiveFilters = search.trim().length > 0 || selectedSession !== null;

  const setSearch = useCallback((value: string) => {
    setRawSearch(value);
    setSelectedSessionId(null);
  }, []);

  const selectSession = useCallback(
    (sessionId: number) => {
      const session = sessions.find((item) => item.id === sessionId);

      if (!session) {
        return;
      }

      setRawSearch(getSessionNumberLabel(session));
      setSelectedSessionId(session.id);
    },
    [sessions],
  );

  const clearSelection = useCallback(() => {
    setRawSearch("");
    setSelectedSessionId(null);
  }, []);

  return {
    search,
    selectedSessionId: selectedSession?.id ?? null,
    selectedSession,
    filteredSessions,
    sessionsToRender,
    hasActiveFilters,
    setSearch,
    selectSession,
    clearSelection,
  };
}
