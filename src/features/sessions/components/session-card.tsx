import {
  getSessionDisplayTitle,
  getSessionNumberLabel,
} from "../lib/session-formatters";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";

import "./session-card.css";

type SessionCardProps = {
  session: Session;
};

export function SessionCard({ session }: SessionCardProps) {
  return (
    <article className="session-card">
      <header className="session-card__header">
        <div>
          <span className="session-card__badge">
            {getSessionNumberLabel(session)}
          </span>

          <h2 className="session-card__title">
            {getSessionDisplayTitle(session)}
          </h2>
        </div>

        <time className="session-card__date" dateTime={session.playedAt}>
          {session.playedAt}
        </time>
      </header>

      <section className="session-card__section">
        <h3 className="session-card__section-title">
          {SESSIONS_CATALOG_CONFIG.copy.session.summaryTitle}
        </h3>

        <p className="session-card__text">{session.summary}</p>
      </section>

      {session.notes ? (
        <section className="session-card__section">
          <h3 className="session-card__section-title">
            {SESSIONS_CATALOG_CONFIG.copy.session.notesTitle}
          </h3>

          <p className="session-card__text">{session.notes}</p>
        </section>
      ) : null}
    </article>
  );
}
