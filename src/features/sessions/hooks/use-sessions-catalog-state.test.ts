// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createSession } from "../testing/session-test-factory";
import { useSessionsCatalogState } from "./use-sessions-catalog-state";

describe("useSessionsCatalogState", () => {
  const sessions = [
    createSession({
      id: 1,
      sessionNumber: 1,
      title: "A chegada",
    }),
    createSession({
      id: 2,
      sessionNumber: 2,
      title: "Ruínas antigas",
    }),
    createSession({
      id: 3,
      sessionNumber: 10,
      title: "O retorno",
    }),
  ];

  it("inicia sem busca, sem seleção e renderizando todas as sessões", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    expect(result.current.search).toBe("");
    expect(result.current.selectedSessionId).toBeNull();
    expect(result.current.selectedSession).toBeNull();
    expect(result.current.filteredSessions).toEqual(sessions);
    expect(result.current.sessionsToRender).toEqual(sessions);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("filtra sessões pela busca textual", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.setSearch("ruinas");
    });

    expect(result.current.selectedSessionId).toBeNull();
    expect(result.current.selectedSession).toBeNull();
    expect(result.current.filteredSessions).toEqual([sessions[1]]);
    expect(result.current.sessionsToRender).toEqual([sessions[1]]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("seleciona sessão automaticamente ao buscar por número direto", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.setSearch("10");
    });

    expect(result.current.selectedSessionId).toBe(3);
    expect(result.current.selectedSession).toEqual(sessions[2]);
    expect(result.current.sessionsToRender).toEqual([sessions[2]]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("seleciona sessão automaticamente ao buscar por label de sessão", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.setSearch("Sessão 2");
    });

    expect(result.current.selectedSessionId).toBe(2);
    expect(result.current.selectedSession).toEqual(sessions[1]);
    expect(result.current.sessionsToRender).toEqual([sessions[1]]);
  });

  it("seleciona sessão manualmente pela sidebar sem preencher o input de busca", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.selectSession(2);
    });

    expect(result.current.search).toBe("");
    expect(result.current.selectedSessionId).toBe(2);
    expect(result.current.selectedSession).toEqual(sessions[1]);
    expect(result.current.sessionsToRender).toEqual([sessions[1]]);
  });

  it("ignora seleção manual para sessão inexistente", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.selectSession(999);
    });

    expect(result.current.search).toBe("");
    expect(result.current.selectedSessionId).toBeNull();
    expect(result.current.selectedSession).toBeNull();
    expect(result.current.sessionsToRender).toEqual(sessions);
  });

  it("limpa busca e seleção", () => {
    const { result } = renderHook(() =>
      useSessionsCatalogState({
        sessions,
      }),
    );

    act(() => {
      result.current.selectSession(2);
    });

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.search).toBe("");
    expect(result.current.selectedSessionId).toBeNull();
    expect(result.current.selectedSession).toBeNull();
    expect(result.current.filteredSessions).toEqual(sessions);
    expect(result.current.sessionsToRender).toEqual(sessions);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
