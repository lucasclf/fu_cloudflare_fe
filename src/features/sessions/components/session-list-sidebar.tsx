import {
  ListSidebar,
  type ListSidebarItem,
} from "@/shared/components/list-sidebar";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import {
  getSessionDisplayTitle,
  getSessionNumberLabel,
} from "../lib/session-formatters";
import type { Session } from "../types/session";

type SessionListSidebarProps = {
  sessions: Session[];
  selectedSessionId: number | null;
  onSelect: (sessionId: number) => void;
  onClearSelection: () => void;
};

export function SessionListSidebar({
  sessions,
  selectedSessionId,
  onSelect,
  onClearSelection,
}: SessionListSidebarProps) {
  const items: ListSidebarItem<number>[] = sessions.map((session) => ({
    id: session.id,
    title: getSessionNumberLabel(session),
    subtitle: getSessionDisplayTitle(session),
  }));

  return (
    <ListSidebar
      ariaLabel={SESSIONS_CATALOG_CONFIG.copy.sidebar.listAriaLabel}
      items={items}
      selectedItemId={selectedSessionId}
      clearSelectionLabel={
        SESSIONS_CATALOG_CONFIG.copy.session.showAllButtonLabel
      }
      emptyMessage={SESSIONS_CATALOG_CONFIG.copy.session.emptySidebarMessage}
      onSelect={onSelect}
      onClearSelection={onClearSelection}
    />
  );
}
