import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";
import { SessionCard } from "./session-card";

import "./session-cards-panel.css";

type SessionCardsPanelProps = {
  sessions: Session[];
};

export function SessionCardsPanel({ sessions }: SessionCardsPanelProps) {
  if (sessions.length === 0) {
    return (
      <p className="session-cards-panel__empty">
        {SESSIONS_CATALOG_CONFIG.copy.session.emptyPanelMessage}
      </p>
    );
  }

  return (
    <div className="session-cards-panel">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
