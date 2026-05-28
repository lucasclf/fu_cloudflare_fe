// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ListSidebar, type ListSidebarItem } from "./list-sidebar";

afterEach(() => {
  cleanup();
});

describe("ListSidebar", () => {
  const items: ListSidebarItem<number>[] = [
    {
      id: 1,
      title: "Arcanista",
      subtitle: "Mestre das arcanas",
    },
    {
      id: 2,
      title: "Guardião",
      subtitle: "Defensor resistente",
    },
  ];

  it("renderiza itens com título e subtítulo", () => {
    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={null}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Lista de teste",
    });

    expect(navigation).toBeTruthy();
    expect(within(navigation).getByText("Arcanista")).toBeTruthy();
    expect(within(navigation).getByText("Mestre das arcanas")).toBeTruthy();
    expect(within(navigation).getByText("Guardião")).toBeTruthy();
    expect(within(navigation).getByText("Defensor resistente")).toBeTruthy();
  });

  it("desabilita botão de limpar quando não há item selecionado", () => {
    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={null}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    const clearButton = screen.getByRole("button", {
      name: "Mostrar todas",
    }) as HTMLButtonElement;

    expect(clearButton.disabled).toBe(true);
  });

  it("habilita botão de limpar quando há item selecionado", () => {
    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={1}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    const clearButton = screen.getByRole("button", {
      name: "Mostrar todas",
    }) as HTMLButtonElement;

    expect(clearButton.disabled).toBe(false);
  });

  it("chama onClearSelection ao clicar no botão de limpar", () => {
    const onClearSelection = vi.fn();

    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={1}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={onClearSelection}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar todas",
      }),
    );

    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it("chama onSelect com id do item clicado", () => {
    const onSelect = vi.fn();

    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={null}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={onSelect}
        onClearSelection={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Guardião").closest("button")!);

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("marca item selecionado com aria-pressed e aria-current", () => {
    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={items}
        selectedItemId={2}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    const selectedButton = screen.getByText("Guardião").closest("button");

    expect(selectedButton?.getAttribute("aria-pressed")).toBe("true");
    expect(selectedButton?.getAttribute("aria-current")).toBe("true");
  });

  it("renderiza mensagem vazia quando não há itens", () => {
    render(
      <ListSidebar
        ariaLabel="Lista de teste"
        items={[]}
        selectedItemId={null}
        clearSelectionLabel="Mostrar todas"
        emptyMessage="Nenhum item encontrado."
        onSelect={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByText("Nenhum item encontrado.")).toBeTruthy();
  });
});
