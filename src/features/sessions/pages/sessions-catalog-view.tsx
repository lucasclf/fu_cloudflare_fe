import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicSessions } from "../api/get-public-sessions";
import { SessionCardsPanel } from "../components/session-cards-panel";
import { SessionListSidebar } from "../components/session-list-sidebar";
import type { Session } from "../types/session";

type SessionsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

function extractSessionNumberFromSearch(value: string): number | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!normalized) {
    return null;
  }

  const directNumberMatch = normalized.match(/^\d+$/);
  if (directNumberMatch) {
    return Number(directNumberMatch[0]);
  }

  const sessionPatternMatch = normalized.match(/^sessao\s+(\d+)$/);
  if (sessionPatternMatch) {
    return Number(sessionPatternMatch[1]);
  }

  return null;
}

export function SessionsCatalogView({
  category,
  onCategoryChange,
}: SessionsCatalogViewProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        console.log("Carregando sessões públicas...");
        setLoading(true);
        setError(null);
        const data = await getPublicSessions();
        setSessions(data);
      } catch {
        setError("Não foi possível carregar as sessões.");
      } finally {
        setLoading(false);
      }
    }

    void loadSessions();
  }, []);

  useEffect(() => {
    const extractedSessionNumber = extractSessionNumberFromSearch(search);

    if (extractedSessionNumber === null) {
      setSelectedSessionId(null);
      return;
    }

    const matchedSession =
      sessions.find(
        (session) => session.session_number === extractedSessionNumber
      ) ?? null;

    setSelectedSessionId(matchedSession ? matchedSession.id : null);
  }, [search, sessions]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sessions;
    }

    return sessions.filter((session) => {
      const sessionNumberOnly = String(session.session_number);
      const sessionNumberLabel = `sessão ${session.session_number}`.toLowerCase();
      const sessionNumberLabelWithoutAccent = `sessao ${session.session_number}`.toLowerCase();
      const title = (session.title ?? "").toLowerCase();

      return (
        sessionNumberOnly.includes(query) ||
        sessionNumberLabel.includes(query) ||
        sessionNumberLabelWithoutAccent.includes(query) ||
        title.includes(query)
      );
    });
  }, [sessions, search]);

  const selectedSession = useMemo(() => {
    if (selectedSessionId === null) {
      return null;
    }

    return sessions.find((session) => session.id === selectedSessionId) ?? null;
  }, [sessions, selectedSessionId]);

  const sessionsToRender = selectedSession ? [selectedSession] : filteredSessions;

  function handleSelectSession(sessionId: number) {
    const session = sessions.find((item) => item.id === sessionId);

    if (!session) {
      return;
    }

    setSearch(`Sessão ${session.session_number}`);
    setSelectedSessionId(session.id);
  }

  function handleClearSelection() {
    setSearch("");
    setSelectedSessionId(null);
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="Sessões"
      sidebarHeaderSubtitle="Sessões da campanha"
      searchPlaceholder="Buscar sessão..."
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        loading ? (
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : error ? (
          <div style={{ padding: "16px" }}>{error}</div>
        ) : (
          <SessionListSidebar
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelect={handleSelectSession}
            onClearSelection={handleClearSelection}
          />
        )
      }
      mainContent={
        loading ? (
          <div>Carregando sessões...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <SessionCardsPanel sessions={sessionsToRender} />
        )
      }
    />
  );
}