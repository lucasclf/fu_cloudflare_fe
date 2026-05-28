import type { Item, ItemType } from "../types/item";

type CreateItemParams = Partial<Item> & {
  id: number;
  name: string;
  itemType: ItemType;
};

export function createItem({
  id,
  name,
  itemType,
  imageKey = null,
  weaponCategory = null,
  damage = null,
  accuracy = null,
  damageType = null,
  grip = null,
  distance = null,
  defenseDice = null,
  defenseBonus = null,
  magicDefenseDice = null,
  magicDefenseBonus = null,
  initiative = null,
  cost = null,
  isMartial = null,
  description = null,
  createdAt = "2026-01-01T00:00:00.000Z",
  updatedAt = null,
}: CreateItemParams): Item {
  return {
    id,
    name,
    itemType,
    imageKey,
    weaponCategory,
    damage,
    accuracy,
    damageType,
    grip,
    distance,
    defenseDice,
    defenseBonus,
    magicDefenseDice,
    magicDefenseBonus,
    initiative,
    cost,
    isMartial,
    description,
    createdAt,
    updatedAt,
  };
}
