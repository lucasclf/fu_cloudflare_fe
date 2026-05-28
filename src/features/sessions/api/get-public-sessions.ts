import { createPublicListFetcher } from "@/shared/lib/create-public-list-fetcher";
import { mapSessionDtosToSessions } from "../lib/session-mapper";
import type { Session } from "../types/session";
import type { SessionDto } from "../types/session-dto";

const fetchPublicSessionDtos = createPublicListFetcher<SessionDto>("sessions");

export async function getPublicSessions(
  signal?: AbortSignal,
): Promise<Session[]> {
  const dtos = await fetchPublicSessionDtos(signal);

  return mapSessionDtosToSessions(dtos);
}
