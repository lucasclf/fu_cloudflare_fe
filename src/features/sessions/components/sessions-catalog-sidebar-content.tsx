import { CatalogStateBoundary } from "@/features/catalog/components/catalog-state-boundary";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";
import { SessionListSidebar } from "./session-list-sidebar";

type SessionsCatalogSidebarContentProps = {
  loading: boolean;
  error: string | null;
  sessions: Session[];
  selectedSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onClearSelection: () => void;
};

export function SessionsCatalogSidebarContent({
  loading,
  error,
  sessions,
  selectedSessionId,
  onSelectSession,
  onClearSelection,
}: SessionsCatalogSidebarContentProps) {
  return (
    <CatalogStateBoundary
      loading={loading}
      error={error}
      loadingMessage={SESSIONS_CATALOG_CONFIG.copy.sidebar.loadingMessage}
    >
      <SessionListSidebar
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelect={onSelectSession}
        onClearSelection={onClearSelection}
      />
    </CatalogStateBoundary>
  );
}
