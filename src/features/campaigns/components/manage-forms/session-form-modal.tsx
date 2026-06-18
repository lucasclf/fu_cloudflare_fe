import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/components/button";
import { createSession } from "../../api/create-session";
import { FormModal, type FormProps } from "./form-modal";

export function SessionFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [sessionNumber, setSessionNumber] = useState("");
  const [playedAt, setPlayedAt] = useState(today);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = sessionNumber !== "" && playedAt !== "" && summary.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createSession(campaignId, {
        session_number: Number(sessionNumber),
        played_at: playedAt,
        title: title.trim() || null,
        summary: summary.trim(),
        notes: notes.trim() || null,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a sessão.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Nova sessão" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="s-number" className="manage-form__label">
              Número <span aria-hidden="true">*</span>
            </label>
            <input
              id="s-number"
              type="number"
              className="manage-form__input"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              min={0}
              required
              autoFocus
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="s-date" className="manage-form__label">
              Data <span aria-hidden="true">*</span>
            </label>
            <input
              id="s-date"
              type="date"
              className="manage-form__input"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-title" className="manage-form__label">Título</label>
          <input
            id="s-title"
            type="text"
            className="manage-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-summary" className="manage-form__label">
            Resumo <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="s-summary"
            className="manage-form__textarea"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-notes" className="manage-form__label">Notas</label>
          <textarea
            id="s-notes"
            className="manage-form__textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="manage-form__checkbox-field">
          <input
            id="s-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="s-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar sessão"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
