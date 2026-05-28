import { describe, expect, it } from "vitest";

import { createSession } from "../testing/session-test-factory";
import {
  getSessionDisplayTitle,
  getSessionNumberLabel,
} from "./session-formatters";

describe("session-formatters", () => {
  it("retorna label da sessão com número", () => {
    const session = createSession({
      id: 1,
      sessionNumber: 7,
    });

    expect(getSessionNumberLabel(session)).toBe("Sessão 7");
  });

  it("retorna título da sessão quando existir", () => {
    const session = createSession({
      id: 1,
      sessionNumber: 7,
      title: "A torre em ruínas",
    });

    expect(getSessionDisplayTitle(session)).toBe("A torre em ruínas");
  });

  it("retorna label como fallback quando título for null", () => {
    const session = createSession({
      id: 1,
      sessionNumber: 7,
      title: null,
    });

    expect(getSessionDisplayTitle(session)).toBe("Sessão 7");
  });
});
