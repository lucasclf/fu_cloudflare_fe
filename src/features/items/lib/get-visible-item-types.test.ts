import { describe, expect, it } from "vitest";

import { createItem } from "../testing/item-test-factory";
import { getVisibleItemTypes } from "./get-visible-item-types";
import { groupItemsByType } from "./group-items-by-type";

describe("getVisibleItemTypes", () => {
  it("retorna apenas tipos com itens quando nenhum tipo está selecionado", () => {
    const groupedItems = groupItemsByType([
      createItem({
        id: 1,
        name: "Espada",
        itemType: "arma",
      }),
      createItem({
        id: 2,
        name: "Escudo",
        itemType: "escudo",
      }),
    ]);

    const result = getVisibleItemTypes({
      groupedItems,
      selectedType: null,
    });

    expect(result).toEqual(["arma", "escudo"]);
  });

  it("retorna apenas o tipo selecionado quando ele possui itens", () => {
    const groupedItems = groupItemsByType([
      createItem({
        id: 1,
        name: "Espada",
        itemType: "arma",
      }),
      createItem({
        id: 2,
        name: "Escudo",
        itemType: "escudo",
      }),
    ]);

    const result = getVisibleItemTypes({
      groupedItems,
      selectedType: "escudo",
    });

    expect(result).toEqual(["escudo"]);
  });

  it("retorna lista vazia quando o tipo selecionado não possui itens", () => {
    const groupedItems = groupItemsByType([
      createItem({
        id: 1,
        name: "Espada",
        itemType: "arma",
      }),
    ]);

    const result = getVisibleItemTypes({
      groupedItems,
      selectedType: "armadura",
    });

    expect(result).toEqual([]);
  });

  it("mantém a ordem definida em itemType_OPTIONS", () => {
    const groupedItems = groupItemsByType([
      createItem({
        id: 1,
        name: "Artefato Antigo",
        itemType: "artefato",
      }),
      createItem({
        id: 2,
        name: "Espada",
        itemType: "arma",
      }),
      createItem({
        id: 3,
        name: "Anel",
        itemType: "acessorio",
      }),
    ]);

    const result = getVisibleItemTypes({
      groupedItems,
      selectedType: null,
    });

    expect(result).toEqual(["arma", "acessorio", "artefato"]);
  });
});