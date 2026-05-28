import type { JobCatalogItem } from "../types/job";

type CreateJobCatalogItemParams = Partial<JobCatalogItem> & {
  id: number;
  name: string;
};

export function createJobCatalogItem({
  id,
  name,
  tagline = null,
  imageKey = null,
  allowsMartialArmor = null,
  allowsMartialShield = null,
  allowsMartialRangedWeapon = null,
  allowsMartialMeleeWeapon = null,
  allowsArcane = null,
  allowsRituals = null,
  canStartProjects = null,
  hpBonus = null,
  mpBonus = null,
  ipBonus = null,
}: CreateJobCatalogItemParams): JobCatalogItem {
  return {
    id,
    name,
    tagline,
    imageKey,
    allowsMartialArmor,
    allowsMartialShield,
    allowsMartialRangedWeapon,
    allowsMartialMeleeWeapon,
    allowsArcane,
    allowsRituals,
    canStartProjects,
    hpBonus,
    mpBonus,
    ipBonus,
  };
}
