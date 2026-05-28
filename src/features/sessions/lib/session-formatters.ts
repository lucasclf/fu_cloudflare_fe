import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import type { Session } from "../types/session";

export function getSessionNumberLabel(session: Session): string {
  return `${SESSIONS_CATALOG_CONFIG.copy.session.badgeLabel} ${session.sessionNumber}`;
}

export function getSessionDisplayTitle(session: Session): string {
  return session.title ?? getSessionNumberLabel(session);
}
