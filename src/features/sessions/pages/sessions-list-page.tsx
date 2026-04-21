import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "../../../shared/components/page-title";
import { getPublicSessions } from "../api/get-public-sessions";
import { SessionFilter } from "../components/session-filter";
import { SessionList } from "../components/session-list";
import type { Session } from "../types/session";

export function SessionsListPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicSessions();
        setSessions(data);
      } catch (err) {
        setError("Não foi possível carregar as sessões.");
      } finally {
        setLoading(false);
      }
    }

    void loadSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    if (!appliedFilter.trim()) {
      return sessions;
    }

    const sessionNumber = Number(appliedFilter);

    if (!Number.isInteger(sessionNumber) || sessionNumber < 0) {
      return [];
    }

    return sessions.filter(
      (session) => session.session_number === sessionNumber
    );
  }, [sessions, appliedFilter]);

  function handleSearch() {
    setAppliedFilter(filterValue);
  }

  function handleClear() {
    setFilterValue("");
    setAppliedFilter("");
  }

  return (
    <div>
      <PageTitle
        title="Sessões"
        subtitle="Lista pública de sessões da campanha."
      />

      <SessionFilter
        value={filterValue}
        onChange={setFilterValue}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {loading ? <p>Carregando sessões...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading && !error ? <SessionList sessions={filteredSessions} /> : null}
    </div>
  );
}