import { describe, expect, it } from "vitest";

import {
  capitalizeFirstLetter,
  getInitials,
  hasText,
  normalizeSearchText,
  renderOptionalValue,
  renderTokenLabel,
  toSnakeCaseKey,
} from "./text-formatters";

describe("text-formatters", () => {
  describe("normalizeSearchText", () => {
    it("normaliza texto para busca", () => {
      expect(normalizeSearchText("  GUARDIÃO Ágil  ")).toBe("guardiao agil");
    });
  });

  describe("hasText", () => {
    it("retorna true para texto preenchido", () => {
      expect(hasText("valor")).toBe(true);
    });

    it("retorna false para texto vazio, null e undefined", () => {
      expect(hasText("   ")).toBe(false);
      expect(hasText(null)).toBe(false);
      expect(hasText(undefined)).toBe(false);
    });
  });

  describe("renderOptionalValue", () => {
    it("renderiza valor preenchido", () => {
      expect(renderOptionalValue("Cena")).toBe("Cena");
      expect(renderOptionalValue(10)).toBe("10");
    });

    it("renderiza traço para valor ausente", () => {
      expect(renderOptionalValue("")).toBe("—");
      expect(renderOptionalValue("   ")).toBe("—");
      expect(renderOptionalValue(null)).toBe("—");
      expect(renderOptionalValue(undefined)).toBe("—");
    });
  });

  describe("renderTokenLabel", () => {
    it("formata token com underscore", () => {
      expect(renderTokenLabel("martial_armor")).toBe("Martial Armor");
    });

    it("retorna traço para valor ausente", () => {
      expect(renderTokenLabel(null)).toBe("—");
      expect(renderTokenLabel(undefined)).toBe("—");
      expect(renderTokenLabel("")).toBe("—");
    });
  });

  describe("getInitials", () => {
    it("retorna iniciais das duas primeiras palavras", () => {
      expect(getInitials("Mestre das Arcanas")).toBe("MD");
    });

    it("permite configurar quantidade de partes", () => {
      expect(getInitials("Mestre das Arcanas", 3)).toBe("MDA");
    });
  });

  describe("toSnakeCaseKey", () => {
    it("converte nome para snake_case sem acentos", () => {
      expect(toSnakeCaseKey("Espada Élfica")).toBe("espada_elfica");
    });

    it("remove caracteres especiais e underscores nas pontas", () => {
      expect(toSnakeCaseKey("  Anel de Fogo (Raro)!  ")).toBe("anel_de_fogo_raro");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("capitaliza primeira letra", () => {
      expect(capitalizeFirstLetter("fogo")).toBe("Fogo");
    });

    it("mantém string vazia", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });
});
