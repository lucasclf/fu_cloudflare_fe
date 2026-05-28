import { describe, expect, it } from "vitest";

import type { ItemDto } from "../types/item-dto";
import { mapItemDtoToItem, mapItemDtosToItems } from "./item-mapper";

describe("item-mapper", () => {
  const dto: ItemDto = {
    id: 1,
    name: "Espada Curta",
    item_type: "arma",
    img_key: "weapons/short-sword.png",
    weapon_category: "espada",
    damage: "d8",
    accuracy: "d10",
    damage_type: "fisico",
    grip: "uma_mao",
    distance: "corpo_a_corpo",
    defense_dice: "d8",
    defense_bonus: 1,
    magic_defense_dice: "d6",
    magic_defense_bonus: 2,
    initiative: "0",
    cost: 100,
    is_martial: true,
    description: "Uma espada curta.",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: null,
  };

  it("mapeia ItemDto para Item", () => {
    expect(mapItemDtoToItem(dto)).toEqual({
      id: 1,
      name: "Espada Curta",
      itemType: "arma",
      imageKey: "weapons/short-sword.png",
      weaponCategory: "espada",
      damage: "d8",
      accuracy: "d10",
      damageType: "fisico",
      grip: "uma_mao",
      distance: "corpo_a_corpo",
      defenseDice: "d8",
      defenseBonus: 1,
      magicDefenseDice: "d6",
      magicDefenseBonus: 2,
      initiative: "0",
      cost: 100,
      isMartial: true,
      description: "Uma espada curta.",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: null,
    });
  });

  it("mapeia lista de ItemDto para Item", () => {
    expect(mapItemDtosToItems([dto])).toEqual([mapItemDtoToItem(dto)]);
  });
});