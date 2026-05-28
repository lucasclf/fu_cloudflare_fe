import type { Session } from "../types/session";

type CreateSessionParams = Partial<Session> & {
  id: number;
  sessionNumber: number;
};

export function createSession({
  id,
  sessionNumber,
  title = null,
  summary = "Resumo da sessão.",
  notes = null,
  playedAt = "2026-01-01",
  createdAt = "2026-01-01T00:00:00.000Z",
  updatedAt = null,
}: CreateSessionParams): Session {
  return {
    id,
    sessionNumber,
    title,
    summary,
    notes,
    playedAt,
    createdAt,
    updatedAt,
  };
}
