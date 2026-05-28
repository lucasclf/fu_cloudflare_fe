import type { JobCatalogItem } from "../types/job";

type CreateJobCatalogItemParams = Partial<JobCatalogItem> & {
  id: number;
  name: string;
};

export function createJobCatalogItem({
  id,
  name,
  tagline = null,
  img_key = null,
  allows_martial_armor = null,
  allows_martial_shield = null,
  allows_martial_ranged_weapon = null,
  allows_martial_melee_weapon = null,
  allows_arcane = null,
  allows_rituals = null,
  can_start_projects = null,
  hp_bonus = null,
  mp_bonus = null,
  ip_bonus = null,
}: CreateJobCatalogItemParams): JobCatalogItem {
  return {
    id,
    name,
    tagline,
    img_key,
    allows_martial_armor,
    allows_martial_shield,
    allows_martial_ranged_weapon,
    allows_martial_melee_weapon,
    allows_arcane,
    allows_rituals,
    can_start_projects,
    hp_bonus,
    mp_bonus,
    ip_bonus,
  };
}