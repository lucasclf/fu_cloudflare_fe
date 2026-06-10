import { useState, useCallback, useRef } from "react";
import { Button } from "@/shared/components/button";
import { searchUsers } from "../api/search-users";
import { sendInvitation } from "../api/send-invitation";
import type { UserSearchResult } from "../types/campaign";
import "./invite-search.css";

type InviteSearchProps = {
  campaignId: number;
  onInvited: () => void;
};

export function InviteSearch({ campaignId, onInvited }: InviteSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitingId, setInvitingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setError(null);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setSearching(true);
        try {
          const data = await searchUsers(value.trim(), campaignId);
          setResults(data);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [campaignId],
  );

  async function handleInvite(user: UserSearchResult) {
    setInvitingId(user.id);
    setError(null);
    try {
      await sendInvitation(campaignId, user.nickname);
      setResults((prev) => prev.filter((r) => r.id !== user.id));
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar o convite.");
    } finally {
      setInvitingId(null);
    }
  }

  return (
    <div className="invite-search">
      <div className="invite-search__input-wrap">
        <svg className="invite-search__icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="invite-search__input"
          type="text"
          placeholder="Buscar por nickname ou e-mail..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          autoComplete="off"
        />
        {searching ? <span className="invite-search__spinner" aria-label="Buscando..." /> : null}
      </div>

      {error ? <p className="invite-search__error">{error}</p> : null}

      {results.length > 0 ? (
        <ul className="invite-search__results">
          {results.map((user) => (
            <li key={user.id} className="invite-search__result">
              <div className="invite-search__result-info">
                <span className="invite-search__result-nickname">{user.nickname}</span>
                <span className="invite-search__result-email">{user.email}</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleInvite(user)}
                disabled={invitingId !== null}
              >
                {invitingId === user.id ? "Enviando..." : "Convidar"}
              </Button>
            </li>
          ))}
        </ul>
      ) : query.trim().length >= 2 && !searching ? (
        <p className="invite-search__empty">Nenhum usuário encontrado.</p>
      ) : null}
    </div>
  );
}
