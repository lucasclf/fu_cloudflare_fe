import { describe, expect, it } from "vitest";

import { createItem } from "../testing/item-test-factory";
import { filterItems } from "./filter-items";

describe("filterItems", () => {
  const items = [
    createItem({
      id: 1,
      name: "Lâmina Curta",
      item_type: "arma",
    }),
    createItem({
      id: 2,
      name: "Armadura Leve",
      item_type: "armadura",
    }),
    createItem({
      id: 3,
      name: "Escudo de Madeira",
      item_type: "escudo",
    }),
  ];

  it("retorna todos os itens quando não há busca nem tipo selecionado", () => {
    const result = filterItems({
      items,
      search: "",
      selectedType: null,
    });

    expect(result).toEqual(items);
  });

  it("filtra itens pelo tipo selecionado", () => {
    const result = filterItems({
      items,
      search: "",
      selectedType: "arma",
    });

    expect(result).toEqual([items[0]]);
  });

  it("filtra itens pelo texto de busca", () => {
    const result = filterItems({
      items,
      search: "escudo",
      selectedType: null,
    });

    expect(result).toEqual([items[2]]);
  });

  it("ignora maiúsculas e minúsculas na busca", () => {
    const result = filterItems({
      items,
      search: "ARMADURA",
      selectedType: null,
    });

    expect(result).toEqual([items[1]]);
  });

  it("ignora acentos na busca", () => {
    const result = filterItems({
      items,
      search: "lamina",
      selectedType: null,
    });

    expect(result).toEqual([items[0]]);
  });

  it("combina busca e tipo selecionado", () => {
    const result = filterItems({
      items,
      search: "leve",
      selectedType: "armadura",
    });

    expect(result).toEqual([items[1]]);
  });

  it("retorna lista vazia quando nenhum item corresponde aos filtros", () => {
    const result = filterItems({
      items,
      search: "machado",
      selectedType: "arma",
    });

    expect(result).toEqual([]);
  });
});