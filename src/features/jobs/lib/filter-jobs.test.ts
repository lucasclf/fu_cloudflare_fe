import { describe, expect, it } from "vitest";

import { createJobCatalogItem } from "../testing/job-test-factory";
import { filterJobs } from "./filter-jobs";

describe("filterJobs", () => {
  const jobs = [
    createJobCatalogItem({
      id: 1,
      name: "Arcanista",
      tagline: "Mestre das arcanas",
      allowsArcane: true,
      mpBonus: 5,
    }),
    createJobCatalogItem({
      id: 2,
      name: "Guardião",
      tagline: "Defensor resistente",
      allowsMartialArmor: "1",
      allowsMartialShield: 1,
      hpBonus: "5",
    }),
    createJobCatalogItem({
      id: 3,
      name: "Inventor",
      tagline: "Especialista em projetos",
      canStartProjects: true,
      ipBonus: 3,
    }),
  ];

  it("retorna todas as classes quando não há busca nem filtros", () => {
    const result = filterJobs({
      jobs,
      search: "",
      selectedFeatureKeys: [],
    });

    expect(result).toEqual(jobs);
  });

  it("filtra por nome ignorando maiúsculas e minúsculas", () => {
    const result = filterJobs({
      jobs,
      search: "GUARDIÃO",
      selectedFeatureKeys: [],
    });

    expect(result).toEqual([jobs[1]]);
  });

  it("filtra por nome ignorando acentos", () => {
    const result = filterJobs({
      jobs,
      search: "guardiao",
      selectedFeatureKeys: [],
    });

    expect(result).toEqual([jobs[1]]);
  });

  it("filtra por tagline", () => {
    const result = filterJobs({
      jobs,
      search: "projetos",
      selectedFeatureKeys: [],
    });

    expect(result).toEqual([jobs[2]]);
  });

  it("filtra por permissão habilitada", () => {
    const result = filterJobs({
      jobs,
      search: "",
      selectedFeatureKeys: ["allowsArcane"],
    });

    expect(result).toEqual([jobs[0]]);
  });

  it("filtra por bônus positivo", () => {
    const result = filterJobs({
      jobs,
      search: "",
      selectedFeatureKeys: ["hpBonus"],
    });

    expect(result).toEqual([jobs[1]]);
  });

  it("combina múltiplos filtros de feature", () => {
    const result = filterJobs({
      jobs,
      search: "",
      selectedFeatureKeys: ["allowsMartialArmor", "allowsMartialShield"],
    });

    expect(result).toEqual([jobs[1]]);
  });

  it("combina busca e filtros de feature", () => {
    const result = filterJobs({
      jobs,
      search: "defensor",
      selectedFeatureKeys: ["hpBonus"],
    });

    expect(result).toEqual([jobs[1]]);
  });

  it("retorna lista vazia quando nenhuma classe corresponde", () => {
    const result = filterJobs({
      jobs,
      search: "arcanista",
      selectedFeatureKeys: ["canStartProjects"],
    });

    expect(result).toEqual([]);
  });
});