import { describe, expect, it } from "vitest";

import { createItem } from "../testing/item-test-factory";
import { getItemAttributes } from "./item-attributes";

describe("getItemAttributes", () => {
  it("retorna atributos de arma", () => {
    const item = createItem({
      id: 1,
      name: "Espada Curta",
      itemType: "arma",
      damage: "d8",
      damageType: "fisico",
      accuracy: "d10",
      grip: "uma_mao",
      distance: "corpo_a_corpo",
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(2);
    expect(result.items).toEqual([
      {
        label: "Dano",
        value: "d8 | Fisico",
      },
      {
        label: "Precisão",
        value: "d10",
      },
      {
        label: "Empunhadura",
        value: "Uma Mão",
      },
      {
        label: "Alcance",
        value: "Corpo a Corpo",
      },
    ]);
  });

  it("inclui defesa e defesa mágica em arma quando existirem", () => {
    const item = createItem({
      id: 1,
      name: "Lança Defensiva",
      itemType: "arma",
      damage: "d8",
      accuracy: "d10",
      defenseDice: "d8",
      defenseBonus: 1,
      magicDefenseDice: "d6",
      magicDefenseBonus: 2,
    });

    const result = getItemAttributes(item);

    expect(result.items).toContainEqual({
      label: "Defesa",
      value: "d8 + 1",
    });

    expect(result.items).toContainEqual({
      label: "Defesa mágica",
      value: "d6 + 2",
    });
  });

  it("inclui descrição especial em arma quando existir descrição", () => {
    const item = createItem({
      id: 1,
      name: "Espada Flamejante",
      itemType: "arma",
      damage: "d10",
      accuracy: "d8",
      description: "Causa dano adicional contra criaturas vulneráveis ao fogo.",
    });

    const result = getItemAttributes(item);

    expect(result.items).toContainEqual({
      label: "Especial",
      value: "Causa dano adicional contra criaturas vulneráveis ao fogo.",
      fullWidth: true,
    });
  });

  it("retorna atributos de armadura com três colunas", () => {
    const item = createItem({
      id: 2,
      name: "Armadura Leve",
      itemType: "armadura",
      defenseDice: "d8",
      defenseBonus: 1,
      magicDefenseDice: "d6",
      magicDefenseBonus: 0,
      initiative: "-1",
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(3);
    expect(result.items).toEqual([
      {
        label: "Defesa",
        value: "d8 + 1",
      },
      {
        label: "Defesa Mágica",
        value: "d6",
      },
      {
        label: "Iniciativa",
        value: "-1",
      },
    ]);
  });

  it("retorna atributos de escudo com três colunas", () => {
    const item = createItem({
      id: 3,
      name: "Escudo de Madeira",
      itemType: "escudo",
      defenseDice: null,
      defenseBonus: 2,
      magicDefenseDice: null,
      magicDefenseBonus: 1,
      initiative: "0",
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(3);
    expect(result.items).toEqual([
      {
        label: "Defesa",
        value: "2",
      },
      {
        label: "Defesa Mágica",
        value: "1",
      },
      {
        label: "Iniciativa",
        value: "0",
      },
    ]);
  });

  it("inclui descrição especial em armadura quando existir descrição", () => {
    const item = createItem({
      id: 4,
      name: "Armadura Rúnica",
      itemType: "armadura",
      defenseDice: "d10",
      magicDefenseDice: "d10",
      description: "Concede resistência mágica situacional.",
    });

    const result = getItemAttributes(item);

    expect(result.items).toContainEqual({
      label: "Especial",
      value: "Concede resistência mágica situacional.",
      fullWidth: true,
    });
  });

  it("retorna descrição para acessório", () => {
    const item = createItem({
      id: 5,
      name: "Anel Antigo",
      itemType: "acessorio",
      description: "Um anel com inscrições antigas.",
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(2);
    expect(result.items).toEqual([
      {
        label: "Descrição",
        value: "Um anel com inscrições antigas.",
        fullWidth: true,
      },
    ]);
  });

  it("retorna fallback de descrição para artefato sem descrição", () => {
    const item = createItem({
      id: 6,
      name: "Artefato Desconhecido",
      itemType: "artefato",
      description: null,
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(2);
    expect(result.items).toEqual([
      {
        label: "Descrição",
        value: "—",
        fullWidth: true,
      },
    ]);
  });

  it("retorna descrição para item do tipo outros", () => {
    const item = createItem({
      id: 7,
      name: "Corda",
      itemType: "outros",
      description: "Uma corda resistente.",
    });

    const result = getItemAttributes(item);

    expect(result.columns).toBe(2);
    expect(result.items).toEqual([
      {
        label: "Descrição",
        value: "Uma corda resistente.",
        fullWidth: true,
      },
    ]);
  });
});