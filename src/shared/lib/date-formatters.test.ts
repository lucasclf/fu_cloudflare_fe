import { describe, expect, it } from "vitest";

import { formatDateLabel } from "./date-formatters";

describe("date-formatters", () => {
  describe("formatDateLabel", () => {
    it("formata data no formato YYYY-MM-DD sem deslocamento de timezone", () => {
      expect(formatDateLabel("2026-01-09")).toBe("09/01/2026");
    });

    it("formata datetime ISO", () => {
      expect(formatDateLabel("2026-01-09T12:00:00.000Z")).toMatch(
        /^\d{2}\/\d{2}\/\d{4}$/,
      );
    });

    it("retorna traço para valor ausente", () => {
      expect(formatDateLabel(null)).toBe("—");
      expect(formatDateLabel(undefined)).toBe("—");
      expect(formatDateLabel("")).toBe("—");
    });

    it("retorna valor original quando data é inválida", () => {
      expect(formatDateLabel("data inválida")).toBe("data inválida");
    });
  });
});
