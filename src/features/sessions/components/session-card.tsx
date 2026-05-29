import { Badge } from "@/shared/components/badge";
import { ContentCard } from "@/shared/components/content-card";
import { ContentSection } from "@/shared/components/content-section";
import { formatDateLabel } from "@/shared/lib/date-formatters";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import {
  getSessionDisplayTitle,
  getSessionNumberLabel,
} from "../lib/session-formatters";
import type { Session } from "../types/session";

import "./session-card.css";

type SessionCardProps = {
  session: Session;
};

export function SessionCard({ session }: SessionCardProps) {
  return (
    <ContentCard as="article" padding="lg" className="session-card">
      <header className="session-card__header">
        <div>
          <Badge variant="accent">{getSessionNumberLabel(session)}</Badge>

          <h2 className="session-card__title">
            {getSessionDisplayTitle(session)}
          </h2>
        </div>

        <time className="session-card__date" dateTime={session.playedAt}>
          {formatDateLabel(session.playedAt)}
        </time>
      </header>

      <ContentSection title={SESSIONS_CATALOG_CONFIG.copy.session.summaryTitle}>
        <p className="session-card__text">{session.summary}</p>
      </ContentSection>

      {session.notes ? (
        <ContentSection title={SESSIONS_CATALOG_CONFIG.copy.session.notesTitle}>
          <p className="session-card__text">{session.notes}</p>
        </ContentSection>
      ) : null}
    </ContentCard>
  );
}