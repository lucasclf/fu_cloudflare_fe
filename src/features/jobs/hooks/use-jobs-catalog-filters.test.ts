// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createJobCatalogItem } from "../testing/job-test-factory";
import { useJobsCatalogFilters } from "./use-jobs-catalog-filters";

describe("useJobsCatalogFilters", () => {
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

  it("inicia sem busca, sem filtros e com todos os jobs", () => {
    const { result } = renderHook(() =>
      useJobsCatalogFilters({
        jobs,
      }),
    );

    expect(result.current.search).toBe("");
    expect(result.current.selectedFeatureKeys).toEqual([]);
    expect(result.current.filteredJobs).toEqual(jobs);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("filtra jobs pela busca", () => {
    const { result } = renderHook(() =>
      useJobsCatalogFilters({
        jobs,
      }),
    );

    act(() => {
      result.current.setSearch("guardiao");
    });

    expect(result.current.filteredJobs).toEqual([jobs[1]]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("ativa e desativa filtro de feature", () => {
    const { result } = renderHook(() =>
      useJobsCatalogFilters({
        jobs,
      }),
    );

    act(() => {
      result.current.toggleFeatureKey("allowsArcane");
    });

    expect(result.current.selectedFeatureKeys).toEqual(["allowsArcane"]);
    expect(result.current.filteredJobs).toEqual([jobs[0]]);
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.toggleFeatureKey("allowsArcane");
    });

    expect(result.current.selectedFeatureKeys).toEqual([]);
    expect(result.current.filteredJobs).toEqual(jobs);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("combina busca e filtro de feature", () => {
    const { result } = renderHook(() =>
      useJobsCatalogFilters({
        jobs,
      }),
    );

    act(() => {
      result.current.setSearch("defensor");
      result.current.toggleFeatureKey("hpBonus");
    });

    expect(result.current.filteredJobs).toEqual([jobs[1]]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("limpa busca e filtros", () => {
    const { result } = renderHook(() =>
      useJobsCatalogFilters({
        jobs,
      }),
    );

    act(() => {
      result.current.setSearch("inventor");
      result.current.toggleFeatureKey("canStartProjects");
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.selectedFeatureKeys).toEqual([]);
    expect(result.current.filteredJobs).toEqual(jobs);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
