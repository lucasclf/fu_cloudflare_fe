import type { JobCatalogItemDto } from "../types/job-dto";
import type { JobCatalogItem } from "../types/job";

export function mapJobCatalogItemDtoToJobCatalogItem(
  dto: JobCatalogItemDto,
): JobCatalogItem {
  return {
    id: dto.id,
    name: dto.name,
    tagline: dto.tagline,
    imageKey: dto.img_key,

    allowsMartialArmor: dto.allows_martial_armor,
    allowsMartialShield: dto.allows_martial_shield,
    allowsMartialRangedWeapon: dto.allows_martial_ranged_weapon,
    allowsMartialMeleeWeapon: dto.allows_martial_melee_weapon,
    allowsArcane: dto.allows_arcane,
    allowsRituals: dto.allows_rituals,
    canStartProjects: dto.can_start_projects,

    hpBonus: dto.hp_bonus,
    mpBonus: dto.mp_bonus,
    ipBonus: dto.ip_bonus,
  };
}

export function mapJobCatalogItemDtosToJobCatalogItems(
  dtos: readonly JobCatalogItemDto[],
): JobCatalogItem[] {
  return dtos.map(mapJobCatalogItemDtoToJobCatalogItem);
}
