import { useMemo, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { ListSidebar } from "@/shared/components/list-sidebar";
import { Button } from "@/shared/components/button";
import { normalizeSearchText } from "@/shared/lib/text-formatters";
import { useEmptyResource, useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignSessions } from "../hooks/use-campaign-sessions";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { updateSession } from "../api/update-session";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";
import type { Session } from "../types/campaign";

import styles from "./campaign-simple-catalog-view.module.css";
import "../pages/campaign-manage-page.css";

type CampaignSessionsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignSessionsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignSessionsCatalogViewProps) {
  const { data: contextData } = useCampaignHomeContext();
  const isMaster = contextData.role === "master";

  const global = useEmptyResource<Session>();
  const campaign = useCampaignSessions(campaignId);
  const { data: sessions, loading, error } = useCombinedCatalog(global, campaign);
  const sessionsList = useMemo(() => sessions ?? [], [sessions]);

  const [search, setSearch] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const filteredSessions = useMemo(() => {
    const query = normalizeSearchText(search);

    return sessionsList
      .filter((session) => {
        if (!query) return true;

        const searchableText = [
          session.title ?? "",
          session.summary,
          session.notes ?? "",
        ].join(" ");

        return normalizeSearchText(searchableText).includes(query);
      })
      .sort((a, b) => b.session_number - a.session_number);
  }, [sessionsList, search]);

  const visibleSessions = useMemo(() => {
    if (selectedSessionId === null) return filteredSessions;
    return filteredSessions.filter((s) => s.id === selectedSessionId);
  }, [filteredSessions, selectedSessionId]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedSessionId(null);
  }

  const sidebarItems = useMemo(() =>
    filteredSessions.map((s) => ({
      id: s.id,
      title: `#${s.session_number} — ${s.title ?? "Sessão sem título"}`,
      subtitle: formatDate(s.played_at),
    })),
    [filteredSessions],
  );

  return (
    <>
      {editingSession ? (
        <SessionEditModal
          campaignId={campaignId}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSuccess={() => {
            setEditingSession(null);
            campaign.reload?.();
          }}
        />
      ) : null}

      <CatalogLayout
        sidebarHeaderTitle="Sessões"
        sidebarHeaderSubtitle="Sessões registradas nesta campanha"
        searchPlaceholder="Buscar sessão..."
        searchValue={search}
        onSearchChange={handleSearchChange}
        categorySwitcher={
          <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
        }
        sidebarContent={
          loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <ListSidebar
              ariaLabel="Lista de sessões"
              items={sidebarItems}
              selectedItemId={selectedSessionId}
              clearSelectionLabel="Mostrar todas"
              emptyMessage="Nenhuma sessão encontrada."
              onSelect={setSelectedSessionId}
              onClearSelection={() => setSelectedSessionId(null)}
            />
          )
        }
        mainContent={
          loading ? (
            <LoadingState message="Carregando sessões..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : visibleSessions.length === 0 ? (
            <p className={styles.empty}>Nenhuma sessão encontrada.</p>
          ) : (
            <ul className={styles.list}>
              {visibleSessions.map((session) => (
                <li key={session.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      #{session.session_number} — {session.title ?? "Sessão sem título"}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <span className={styles.cardMeta}>
                        {formatDate(session.played_at)}
                      </span>
                      {isMaster ? (
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => setEditingSession(session)}
                          aria-label="Editar sessão"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <p className={styles.cardBody}>{session.summary}</p>

                  {session.notes ? (
                    <div className={styles.cardSection}>
                      <p className={styles.cardSectionLabel}>Notas</p>
                      <p className={styles.cardBody}>{session.notes}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )
        }
      />
    </>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type SessionEditModalProps = {
  campaignId: number;
  session: Session;
  onClose: () => void;
  onSuccess: () => void;
};

function SessionEditModal({ campaignId, session, onClose, onSuccess }: SessionEditModalProps) {
  const [title, setTitle] = useState(session.title ?? "");
  const [summary, setSummary] = useState(session.summary);
  const [notes, setNotes] = useState(session.notes ?? "");
  const [playedAt, setPlayedAt] = useState(session.played_at.substring(0, 10));
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateSession(campaignId, session.id, {
        title: title.trim() || null,
        summary: summary.trim(),
        notes: notes.trim() || null,
        played_at: playedAt,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = summary.trim() !== "" && playedAt !== "";

  return (
    <div
      className="manage-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="manage-modal" role="dialog" aria-modal="true">
        <div className="manage-modal__header">
          <h2 className="manage-modal__title">Editar sessão #{session.session_number}</h2>
          <button type="button" className="manage-modal__close" onClick={onClose} aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="manage-modal__body">
          <form onSubmit={handleSubmit} noValidate>
            {error ? <p className="manage-form__error">{error}</p> : null}

            <div className="manage-form__field">
              <label htmlFor="se-title" className="manage-form__label">Título</label>
              <input
                id="se-title"
                type="text"
                className="manage-form__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da sessão (opcional)"
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="se-summary" className="manage-form__label">
                Resumo <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="se-summary"
                className="manage-form__textarea"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="se-notes" className="manage-form__label">Notas</label>
              <textarea
                id="se-notes"
                className="manage-form__textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="se-date" className="manage-form__label">
                Data <span aria-hidden="true">*</span>
              </label>
              <input
                id="se-date"
                type="date"
                className="manage-form__input"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                required
              />
            </div>

            <div className="manage-form__checkbox-field">
              <input
                id="se-visible"
                type="checkbox"
                className="manage-form__checkbox"
                checked={visibleToPlayers}
                onChange={(e) => setVisibleToPlayers(e.target.checked)}
              />
              <label htmlFor="se-visible" className="manage-form__checkbox-label">
                Visível para jogadores
              </label>
            </div>

            <div className="manage-form__actions">
              <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
                {submitting ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
