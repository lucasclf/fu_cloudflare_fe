import { describe, expect, it } from "vitest";

import type { SessionDto } from "../types/session-dto";
import {
  mapSessionDtoToSession,
  mapSessionDtosToSessions,
} from "./session-mapper";

describe("session-mapper", () => {
  const dto: SessionDto = {
    id: 1,
    session_number: 7,
    title: "A torre em ruínas",
    summary: "O grupo explorou uma torre antiga.",
    notes: "Encontraram pistas sobre o vilão.",
    played_at: "2026-01-01",
    created_at: "2026-01-02T00:00:00.000Z",
    updated_at: null,
  };

  it("mapeia SessionDto para Session", () => {
    expect(mapSessionDtoToSession(dto)).toEqual({
      id: 1,
      sessionNumber: 7,
      title: "A torre em ruínas",
      summary: "O grupo explorou uma torre antiga.",
      notes: "Encontraram pistas sobre o vilão.",
      playedAt: "2026-01-01",
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: null,
    });
  });

  it("mapeia lista de SessionDto", () => {
    expect(mapSessionDtosToSessions([dto])).toEqual([
      mapSessionDtoToSession(dto),
    ]);
  });
});
