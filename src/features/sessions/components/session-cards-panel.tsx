import { CatalogContentStack } from "@/features/catalog/components/catalog-content-stack";
import { CatalogEmptyMessage } from "@/features/catalog/components/catalog-empty-message";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";
import { SessionCard } from "./session-card";

type SessionCardsPanelProps = {
  sessions: Session[];
};

export function SessionCardsPanel({ sessions }: SessionCardsPanelProps) {
  if (sessions.length === 0) {
    return (
      <CatalogEmptyMessage>
        {SESSIONS_CATALOG_CONFIG.copy.session.emptyPanelMessage}
      </CatalogEmptyMessage>
    );
  }

  return (
    <CatalogContentStack>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </CatalogContentStack>
  );
}