import { getSessionNumberLabel } from "./session-formatters";
import type { Session } from "../types/session";

type FilterSessionsParams = {
  sessions: readonly Session[];
  search: string;
};

export function filterSessions({
  sessions,
  search,
}: FilterSessionsParams): Session[] {
  const query = normalizeSessionSearchText(search);

  if (query.length === 0) {
    return [...sessions];
  }

  return sessions.filter((session) => {
    const sessionNumber = String(session.sessionNumber);
    const sessionLabel = normalizeSessionSearchText(
      getSessionNumberLabel(session),
    );
    const title = normalizeSessionSearchText(session.title ?? "");

    return (
      sessionNumber.includes(query) ||
      sessionLabel.includes(query) ||
      title.includes(query)
    );
  });
}

export function extractSessionNumberFromSearch(value: string): number | null {
  const normalized = normalizeSessionSearchText(value);

  if (normalized.length === 0) {
    return null;
  }

  const directNumberMatch = normalized.match(/^\d+$/);

  if (directNumberMatch) {
    return Number(directNumberMatch[0]);
  }

  const sessionPatternMatch = normalized.match(/^sessao\s+(\d+)$/);

  if (sessionPatternMatch) {
    return Number(sessionPatternMatch[1]);
  }

  return null;
}

export function normalizeSessionSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
