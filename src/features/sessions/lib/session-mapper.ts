import type { SessionDto } from "../types/session-dto";
import type { Session } from "../types/session";

export function mapSessionDtoToSession(dto: SessionDto): Session {
  return {
    id: dto.id,
    sessionNumber: dto.session_number,
    title: dto.title,
    summary: dto.summary,
    notes: dto.notes,
    playedAt: dto.played_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapSessionDtosToSessions(
  dtos: readonly SessionDto[],
): Session[] {
  return dtos.map(mapSessionDtoToSession);
}
