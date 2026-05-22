import { describe, expect, it } from "vitest";

import { createItem } from "../testing/item-test-factory";
import { getItemAttributes } from "./item-attributes";

describe("getItemAttributes", () => {
  it("retorna atributos de arma", () => {
    const item = createItem({
      id: 1,
      name: "Espada Curta",
      item_type: "arma",
      damage: "d8",
      damage_type: "fisico",
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
      item_type: "arma",
      damage: "d8",
      accuracy: "d10",
      defense_dice: "d8",
      defense_bonus: 1,
      magic_defense_dice: "d6",
      magic_defense_bonus: 2,
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
      item_type: "arma",
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
      item_type: "armadura",
      defense_dice: "d8",
      defense_bonus: 1,
      magic_defense_dice: "d6",
      magic_defense_bonus: 0,
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
      item_type: "escudo",
      defense_dice: null,
      defense_bonus: 2,
      magic_defense_dice: null,
      magic_defense_bonus: 1,
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
      item_type: "armadura",
      defense_dice: "d10",
      magic_defense_dice: "d10",
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
      item_type: "acessorio",
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
      item_type: "artefato",
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
      item_type: "outros",
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