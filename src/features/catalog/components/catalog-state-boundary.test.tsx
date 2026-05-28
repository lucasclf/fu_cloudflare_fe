// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CatalogStateBoundary } from "./catalog-state-boundary";

afterEach(() => {
  cleanup();
});

describe("CatalogStateBoundary", () => {
  it("renderiza estado de loading", () => {
    render(
      <CatalogStateBoundary
        loading
        error={null}
        loadingMessage="Carregando dados..."
      >
        <p>Conteúdo</p>
      </CatalogStateBoundary>,
    );

    expect(screen.getByText("Carregando dados...")).toBeTruthy();
    expect(screen.queryByText("Conteúdo")).toBeNull();
  });

  it("renderiza estado de erro", () => {
    render(
      <CatalogStateBoundary
        loading={false}
        error="Erro ao carregar."
        loadingMessage="Carregando dados..."
      >
        <p>Conteúdo</p>
      </CatalogStateBoundary>,
    );

    expect(screen.getByText("Erro ao carregar.")).toBeTruthy();
    expect(screen.queryByText("Conteúdo")).toBeNull();
  });

  it("renderiza estado vazio", () => {
    render(
      <CatalogStateBoundary
        loading={false}
        error={null}
        loadingMessage="Carregando dados..."
        emptyState={{
          isEmpty: true,
          title: "Nenhum resultado",
          description: "Tente alterar os filtros.",
        }}
      >
        <p>Conteúdo</p>
      </CatalogStateBoundary>,
    );

    expect(screen.getByText("Nenhum resultado")).toBeTruthy();
    expect(screen.getByText("Tente alterar os filtros.")).toBeTruthy();
    expect(screen.queryByText("Conteúdo")).toBeNull();
  });

  it("renderiza children quando não há loading, erro ou empty state", () => {
    render(
      <CatalogStateBoundary
        loading={false}
        error={null}
        loadingMessage="Carregando dados..."
        emptyState={{
          isEmpty: false,
          title: "Nenhum resultado",
          description: "Tente alterar os filtros.",
        }}
      >
        <p>Conteúdo</p>
      </CatalogStateBoundary>,
    );

    expect(screen.getByText("Conteúdo")).toBeTruthy();
  });

  it("prioriza loading antes de erro e empty state", () => {
    render(
      <CatalogStateBoundary
        loading
        error="Erro ao carregar."
        loadingMessage="Carregando dados..."
        emptyState={{
          isEmpty: true,
          title: "Nenhum resultado",
          description: "Tente alterar os filtros.",
        }}
      >
        <p>Conteúdo</p>
      </CatalogStateBoundary>,
    );

    expect(screen.getByText("Carregando dados...")).toBeTruthy();
    expect(screen.queryByText("Erro ao carregar.")).toBeNull();
    expect(screen.queryByText("Nenhum resultado")).toBeNull();
    expect(screen.queryByText("Conteúdo")).toBeNull();
  });
});
