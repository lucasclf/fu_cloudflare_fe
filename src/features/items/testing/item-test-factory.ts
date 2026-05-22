import type { Item, ItemType } from "../types/item";

type CreateItemParams = Partial<Item> & {
  id: number;
  name: string;
  item_type: ItemType;
};

export function createItem({
  id,
  name,
  item_type,
  img_key = null,
  weapon_category = null,
  damage = null,
  accuracy = null,
  damage_type = null,
  grip = null,
  distance = null,
  defense_dice = null,
  defense_bonus = null,
  magic_defense_dice = null,
  magic_defense_bonus = null,
  initiative = null,
  cost = null,
  is_martial = null,
  description = null,
  created_at = "2026-01-01T00:00:00.000Z",
  updated_at = null,
}: CreateItemParams): Item {
  return {
    id,
    name,
    item_type,
    img_key,
    weapon_category,
    damage,
    accuracy,
    damage_type,
    grip,
    distance,
    defense_dice,
    defense_bonus,
    magic_defense_dice,
    magic_defense_bonus,
    initiative,
    cost,
    is_martial,
    description,
    created_at,
    updated_at,
  };
}