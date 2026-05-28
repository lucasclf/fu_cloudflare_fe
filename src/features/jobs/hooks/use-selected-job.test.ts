// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createJobCatalogItem } from "../testing/job-test-factory";
import { useSelectedJob } from "./use-selected-job";

describe("useSelectedJob", () => {
  const jobs = [
    createJobCatalogItem({
      id: 1,
      name: "Arcanista",
    }),
    createJobCatalogItem({
      id: 2,
      name: "Guardião",
    }),
  ];

  it("inicia sem job selecionado", () => {
    const { result } = renderHook(() =>
      useSelectedJob({
        jobs,
      }),
    );

    expect(result.current.selectedJobId).toBeNull();
    expect(result.current.selectedCatalogJob).toBeNull();
  });

  it("seleciona job pelo id", () => {
    const { result } = renderHook(() =>
      useSelectedJob({
        jobs,
      }),
    );

    act(() => {
      result.current.selectJob(2);
    });

    expect(result.current.selectedJobId).toBe(2);
    expect(result.current.selectedCatalogJob).toEqual(jobs[1]);
  });

  it("limpa job selecionado", () => {
    const { result } = renderHook(() =>
      useSelectedJob({
        jobs,
      }),
    );

    act(() => {
      result.current.selectJob(1);
    });

    expect(result.current.selectedCatalogJob).toEqual(jobs[0]);

    act(() => {
      result.current.clearSelectedJob();
    });

    expect(result.current.selectedJobId).toBeNull();
    expect(result.current.selectedCatalogJob).toBeNull();
  });

  it("retorna selectedCatalogJob null quando job selecionado não existe mais na lista", () => {
    const { result, rerender } = renderHook(
      ({ currentJobs }) =>
        useSelectedJob({
          jobs: currentJobs,
        }),
      {
        initialProps: {
          currentJobs: jobs,
        },
      },
    );

    act(() => {
      result.current.selectJob(2);
    });

    expect(result.current.selectedCatalogJob).toEqual(jobs[1]);

    rerender({
      currentJobs: [jobs[0]],
    });

    expect(result.current.selectedJobId).toBe(2);
    expect(result.current.selectedCatalogJob).toBeNull();
  });
});