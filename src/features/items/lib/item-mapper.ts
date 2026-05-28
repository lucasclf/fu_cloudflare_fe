import type { ItemDto } from "../types/item-dto";
import type { Item } from "../types/item";

export function mapItemDtoToItem(dto: ItemDto): Item {
  return {
    id: dto.id,
    name: dto.name,
    itemType: dto.item_type,
    imageKey: dto.img_key,
    weaponCategory: dto.weapon_category,
    damage: dto.damage,
    accuracy: dto.accuracy,
    damageType: dto.damage_type,
    grip: dto.grip,
    distance: dto.distance,
    defenseDice: dto.defense_dice,
    defenseBonus: dto.defense_bonus,
    magicDefenseDice: dto.magic_defense_dice,
    magicDefenseBonus: dto.magic_defense_bonus,
    initiative: dto.initiative,
    cost: dto.cost,
    isMartial: dto.is_martial,
    description: dto.description,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapItemDtosToItems(dtos: readonly ItemDto[]): Item[] {
  return dtos.map(mapItemDtoToItem);
}