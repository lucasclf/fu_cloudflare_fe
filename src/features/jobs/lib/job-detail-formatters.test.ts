import { describe, expect, it } from "vitest";

import type { JobArcana, JobSpell } from "../types/job";
import {
  getArcanaDetails,
  getArcanaDomains,
  getSpellCost,
  getSpellDuration,
  getSpellTarget,
  getSpellType,
  hasItems,
  isSpellOffensive,
} from "./job-detail-formatters";

describe("job-detail-formatters", () => {
  describe("hasItems", () => {
    it("retorna true quando lista possui itens", () => {
      expect(hasItems([1])).toBe(true);
    });

    it("retorna false para lista vazia, null e undefined", () => {
      expect(hasItems([])).toBe(false);
      expect(hasItems(null)).toBe(false);
      expect(hasItems(undefined)).toBe(false);
    });
  });

  describe("getArcanaDetails", () => {
    it("retorna apenas detalhes com texto", () => {
      const arcana = {
        mergeEffect: "Efeito ao fundir.",
        dismissEffect: "",
        specialRule: "Regra especial.",
      } as JobArcana;

      expect(getArcanaDetails(arcana)).toEqual([
        {
          label: "Efeito de Fusão",
          value: "Efeito ao fundir.",
        },
        {
          label: "Regra Especial",
          value: "Regra especial.",
        },
      ]);
    });
  });

  describe("getArcanaDomains", () => {
    it("separa domínios por vírgula e capitaliza", () => {
      expect(getArcanaDomains("fogo, gelo, luz")).toEqual([
        "Fogo",
        "Gelo",
        "Luz",
      ]);
    });

    it("ignora valores vazios", () => {
      expect(getArcanaDomains("fogo, , luz")).toEqual(["Fogo", "Luz"]);
    });

    it("retorna lista vazia para valor vazio", () => {
      expect(getArcanaDomains("   ")).toEqual([]);
      expect(getArcanaDomains(null)).toEqual([]);
      expect(getArcanaDomains(undefined)).toEqual([]);
    });
  });

  describe("spell formatters", () => {
    it("lê tipo da magia", () => {
      const spell = {
        type: "ofensiva",
      } as JobSpell;

      expect(getSpellType(spell)).toBe("ofensiva");
    });

    it("lê custo priorizando cost", () => {
      const spell = {
        cost: 10,
        mpCost: 20,
      } as JobSpell;

      expect(getSpellCost(spell)).toBe(10);
    });

    it("lê mpCost quando cost não existe", () => {
      const spell = {
        mpCost: 20,
      } as JobSpell;

      expect(getSpellCost(spell)).toBe(20);
    });

    it("lê alvo e duração", () => {
      const spell = {
        target: "Uma criatura",
        duration: "Cena",
      } as JobSpell;

      expect(getSpellTarget(spell)).toBe("Uma criatura");
      expect(getSpellDuration(spell)).toBe("Cena");
    });

    it("retorna undefined para texto vazio", () => {
      const spell = {
        target: "   ",
      } as JobSpell;

      expect(getSpellTarget(spell)).toBeUndefined();
    });
  });

  describe("isSpellOffensive", () => {
    it("identifica valores verdadeiros", () => {
      expect(isSpellOffensive({ isOffensive: true } as JobSpell)).toBe(true);
      expect(isSpellOffensive({ isOffensive: 1 } as JobSpell)).toBe(true);
      expect(isSpellOffensive({ isOffensive: "1" } as JobSpell)).toBe(true);
    });

    it("identifica valores falsos", () => {
      expect(isSpellOffensive({ isOffensive: false } as JobSpell)).toBe(false);
      expect(isSpellOffensive({ isOffensive: 0 } as JobSpell)).toBe(false);
      expect(isSpellOffensive({ isOffensive: "0" } as JobSpell)).toBe(false);
    });

    it("retorna null quando valor é ausente ou inválido", () => {
      expect(isSpellOffensive({} as JobSpell)).toBeNull();
      expect(isSpellOffensive({ isOffensive: "sim" } as JobSpell)).toBeNull();
    });
  });
});