import { describe, expect, it } from "vitest";

import { createJobCatalogItem } from "../testing/job-test-factory";
import {
  getPositiveJobBonus,
  isJobAllowanceEnabled,
  isJobBonusKey,
  jobMatchesFeatureFilter,
} from "../lib/job-feature-filters";

describe("job-feature-filters", () => {
  describe("isJobAllowanceEnabled", () => {
    it("retorna true para true, 1 e string 1", () => {
      expect(isJobAllowanceEnabled(true)).toBe(true);
      expect(isJobAllowanceEnabled(1)).toBe(true);
      expect(isJobAllowanceEnabled("1")).toBe(true);
    });

    it("retorna false para false, 0, string 0, null e undefined", () => {
      expect(isJobAllowanceEnabled(false)).toBe(false);
      expect(isJobAllowanceEnabled(0)).toBe(false);
      expect(isJobAllowanceEnabled("0")).toBe(false);
      expect(isJobAllowanceEnabled(null)).toBe(false);
      expect(isJobAllowanceEnabled(undefined)).toBe(false);
    });
  });

  describe("getPositiveJobBonus", () => {
    it("retorna bônus positivo numérico", () => {
      expect(getPositiveJobBonus(5)).toBe(5);
    });

    it("retorna bônus positivo vindo como string", () => {
      expect(getPositiveJobBonus("3")).toBe(3);
    });

    it("retorna zero para bônus zero, negativo, null, undefined ou inválido", () => {
      expect(getPositiveJobBonus(0)).toBe(0);
      expect(getPositiveJobBonus(-1)).toBe(0);
      expect(getPositiveJobBonus(null)).toBe(0);
      expect(getPositiveJobBonus(undefined)).toBe(0);
      expect(getPositiveJobBonus("abc")).toBe(0);
    });
  });

  describe("isJobBonusKey", () => {
    it("identifica chaves de bônus", () => {
      expect(isJobBonusKey("hp_bonus")).toBe(true);
      expect(isJobBonusKey("mp_bonus")).toBe(true);
      expect(isJobBonusKey("ip_bonus")).toBe(true);
    });

    it("não identifica permissões como bônus", () => {
      expect(isJobBonusKey("allows_arcane")).toBe(false);
      expect(isJobBonusKey("can_start_projects")).toBe(false);
    });
  });

  describe("jobMatchesFeatureFilter", () => {
    it("valida filtro de permissão habilitada", () => {
      const job = createJobCatalogItem({
        id: 1,
        name: "Arcanista",
        allows_arcane: "1",
      });

      expect(jobMatchesFeatureFilter(job, "allows_arcane")).toBe(true);
    });

    it("valida filtro de permissão desabilitada", () => {
      const job = createJobCatalogItem({
        id: 1,
        name: "Arcanista",
        allows_arcane: "0",
      });

      expect(jobMatchesFeatureFilter(job, "allows_arcane")).toBe(false);
    });

    it("valida filtro de bônus positivo", () => {
      const job = createJobCatalogItem({
        id: 1,
        name: "Guardião",
        hp_bonus: "5",
      });

      expect(jobMatchesFeatureFilter(job, "hp_bonus")).toBe(true);
    });

    it("valida filtro de bônus ausente", () => {
      const job = createJobCatalogItem({
        id: 1,
        name: "Guardião",
        hp_bonus: 0,
      });

      expect(jobMatchesFeatureFilter(job, "hp_bonus")).toBe(false);
    });
  });
});