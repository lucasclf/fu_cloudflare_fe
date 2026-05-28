import { describe, expect, it } from "vitest";

import {
  formatItemCapitalizedValue,
  formatItemCategoryBadgeValue,
  formatItemDamageWithType,
  formatItemDefenseValue,
  formatItemDistanceValue,
  formatItemGripValue,
  formatNullableItemValue,
  hasTextContent,
} from "./item-formatters";

describe("item-formatters", () => {
  describe("formatItemDefenseValue", () => {
    it("formata defesa com dado e bônus positivo", () => {
      expect(formatItemDefenseValue("d10", 2)).toBe("d10 + 2");
    });

    it("formata defesa com dado e bônus negativo", () => {
      expect(formatItemDefenseValue("d8", -1)).toBe("d8 - 1");
    });

    it("retorna apenas o dado quando não há bônus", () => {
      expect(formatItemDefenseValue("d12", null)).toBe("d12");
    });

    it("retorna apenas o dado quando bônus é zero", () => {
      expect(formatItemDefenseValue("d12", 0)).toBe("d12");
    });

    it("retorna apenas o bônus quando não há dado", () => {
      expect(formatItemDefenseValue(null, 3)).toBe("3");
    });

    it("retorna fallback quando não há dado nem bônus", () => {
      expect(formatItemDefenseValue(null, null)).toBe("???");
    });

    it("ignora string vazia no dado", () => {
      expect(formatItemDefenseValue("   ", 2)).toBe("2");
    });

    it("aceita bônus numérico vindo como string", () => {
      expect(formatItemDefenseValue("d10", "2")).toBe("d10 + 2");
    });
  });

  describe("formatNullableItemValue", () => {
    it("retorna fallback para null", () => {
      expect(formatNullableItemValue(null)).toBe("—");
    });

    it("retorna fallback para undefined", () => {
      expect(formatNullableItemValue(undefined)).toBe("—");
    });

    it("retorna fallback para string vazia", () => {
      expect(formatNullableItemValue("   ")).toBe("—");
    });

    it("converte número para string", () => {
      expect(formatNullableItemValue(10)).toBe("10");
    });

    it("permite fallback customizado", () => {
      expect(formatNullableItemValue(null, "???")).toBe("???");
    });
  });

  describe("formatItemCategoryBadgeValue", () => {
    it("retorna null para valor nulo", () => {
      expect(formatItemCategoryBadgeValue(null)).toBeNull();
    });

    it("retorna null para string vazia", () => {
      expect(formatItemCategoryBadgeValue("   ")).toBeNull();
    });

    it("substitui underscore por espaço e capitaliza primeira letra", () => {
      expect(formatItemCategoryBadgeValue("arma_de_fogo")).toBe("Arma de fogo");
    });

    it("capitaliza categoria simples", () => {
      expect(formatItemCategoryBadgeValue("adaga")).toBe("Adaga");
    });
  });

  describe("formatItemDamageWithType", () => {
    it("retorna apenas o dano quando não há tipo de dano", () => {
      expect(formatItemDamageWithType("d8", null)).toBe("d8");
    });

    it("retorna dano com tipo capitalizado", () => {
      expect(formatItemDamageWithType("d10", "fogo")).toBe("d10 | Fogo");
    });

    it("usa fallback quando dano é nulo", () => {
      expect(formatItemDamageWithType(null, "gelo")).toBe("— | Gelo");
    });
  });

  describe("formatItemCapitalizedValue", () => {
    it("retorna fallback para null", () => {
      expect(formatItemCapitalizedValue(null)).toBe("—");
    });

    it("capitaliza a primeira letra", () => {
      expect(formatItemCapitalizedValue("fogo")).toBe("Fogo");
    });
  });

  describe("formatItemGripValue", () => {
    it("formata uma mão", () => {
      expect(formatItemGripValue("uma_mao")).toBe("Uma Mão");
    });

    it("formata duas mãos", () => {
      expect(formatItemGripValue("duas_maos")).toBe("Duas Mãos");
    });

    it("retorna fallback para null", () => {
      expect(formatItemGripValue(null)).toBe("—");
    });
  });

  describe("formatItemDistanceValue", () => {
    it("formata corpo a corpo", () => {
      expect(formatItemDistanceValue("corpo_a_corpo")).toBe("Corpo a Corpo");
    });

    it("formata a distância", () => {
      expect(formatItemDistanceValue("a_distancia")).toBe("Distância");
    });

    it("formata distancia sem prefixo", () => {
      expect(formatItemDistanceValue("distancia")).toBe("Distância");
    });

    it("retorna fallback para null", () => {
      expect(formatItemDistanceValue(null)).toBe("—");
    });
  });

  describe("hasTextContent", () => {
    it("retorna false para null", () => {
      expect(hasTextContent(null)).toBe(false);
    });

    it("retorna false para undefined", () => {
      expect(hasTextContent(undefined)).toBe(false);
    });

    it("retorna false para string vazia", () => {
      expect(hasTextContent("   ")).toBe(false);
    });

    it("retorna true para texto válido", () => {
      expect(hasTextContent("texto")).toBe(true);
    });
  });
});
