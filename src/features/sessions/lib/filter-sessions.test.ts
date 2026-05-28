import { describe, expect, it } from "vitest";

import { createSession } from "../testing/session-test-factory";
import {
  extractSessionNumberFromSearch,
  filterSessions,
} from "./filter-sessions";

describe("filter-sessions", () => {
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

  describe("filterSessions", () => {
    it("retorna todas as sessões quando busca está vazia", () => {
      expect(
        filterSessions({
          sessions,
          search: "",
        }),
      ).toEqual(sessions);
    });

    it("filtra por número direto", () => {
      expect(
        filterSessions({
          sessions,
          search: "10",
        }),
      ).toEqual([sessions[2]]);
    });

    it("filtra por texto sessão com acento", () => {
      expect(
        filterSessions({
          sessions,
          search: "Sessão 2",
        }),
      ).toEqual([sessions[1]]);
    });

    it("filtra por texto sessao sem acento", () => {
      expect(
        filterSessions({
          sessions,
          search: "sessao 2",
        }),
      ).toEqual([sessions[1]]);
    });

    it("filtra por título ignorando acentos", () => {
      expect(
        filterSessions({
          sessions,
          search: "ruinas",
        }),
      ).toEqual([sessions[1]]);
    });

    it("retorna lista vazia quando não encontra resultado", () => {
      expect(
        filterSessions({
          sessions,
          search: "dragão",
        }),
      ).toEqual([]);
    });
  });

  describe("extractSessionNumberFromSearch", () => {
    it("extrai número direto", () => {
      expect(extractSessionNumberFromSearch("10")).toBe(10);
    });

    it("extrai número de sessão com acento", () => {
      expect(extractSessionNumberFromSearch("Sessão 7")).toBe(7);
    });

    it("extrai número de sessao sem acento", () => {
      expect(extractSessionNumberFromSearch("sessao 12")).toBe(12);
    });

    it("retorna null para texto não numérico", () => {
      expect(extractSessionNumberFromSearch("ruínas")).toBeNull();
    });

    it("retorna null para string vazia", () => {
      expect(extractSessionNumberFromSearch("   ")).toBeNull();
    });
  });
});
