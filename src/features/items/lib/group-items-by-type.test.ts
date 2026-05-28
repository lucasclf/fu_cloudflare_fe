import { describe, expect, it } from "vitest";

import { createItem } from "../testing/item-test-factory";
import { groupItemsByType } from "./group-items-by-type";

describe("groupItemsByType", () => {
  it("cria todos os grupos mesmo quando a lista está vazia", () => {
    const result = groupItemsByType([]);

    expect(result).toEqual({
      arma: [],
      armadura: [],
      escudo: [],
      acessorio: [],
      artefato: [],
      outros: [],
    });
  });

  it("agrupa itens pelo tipo", () => {
    const sword = createItem({
      id: 1,
      name: "Espada",
      itemType: "arma",
    });

    const bow = createItem({
      id: 2,
      name: "Arco",
      itemType: "arma",
    });

    const armor = createItem({
      id: 3,
      name: "Armadura",
      itemType: "armadura",
    });

    const result = groupItemsByType([sword, bow, armor]);

    expect(result.arma).toEqual([sword, bow]);
    expect(result.armadura).toEqual([armor]);
    expect(result.escudo).toEqual([]);
    expect(result.acessorio).toEqual([]);
    expect(result.artefato).toEqual([]);
    expect(result.outros).toEqual([]);
  });
});