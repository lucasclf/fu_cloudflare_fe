import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";
import { SessionCardsPanel } from "./session-cards-panel";

type SessionsCatalogMainContentProps = {
  loading: boolean;
  error: string | null;
  sessions: Session[];
  hasActiveFilters: boolean;
};

export function SessionsCatalogMainContent({
  loading,
  error,
  sessions,
  hasActiveFilters,
}: SessionsCatalogMainContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={SESSIONS_CATALOG_CONFIG.copy.main.loadingMessage}
      emptyState={{
        isEmpty: sessions.length === 0,
        title: SESSIONS_CATALOG_CONFIG.copy.emptyState.title,
        description: hasActiveFilters
          ? SESSIONS_CATALOG_CONFIG.copy.emptyState.descriptionWithFilters
          : SESSIONS_CATALOG_CONFIG.copy.emptyState.descriptionWithoutFilters,
      }}
    >
      <SessionCardsPanel sessions={sessions} />
    </CatalogStateBoundary>
  );
}
