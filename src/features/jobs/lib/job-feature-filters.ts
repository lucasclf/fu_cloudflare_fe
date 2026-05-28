import type { JobBonusValue, JobCatalogItem, JobFlagValue } from "../types/job";

export type AllowanceKey = keyof Pick<
  JobCatalogItem,
  | "allows_martial_armor"
  | "allows_martial_shield"
  | "allows_martial_ranged_weapon"
  | "allows_martial_melee_weapon"
  | "allows_arcane"
  | "allows_rituals"
  | "can_start_projects"
>;

export type BonusKey = keyof Pick<
  JobCatalogItem,
  "hp_bonus" | "mp_bonus" | "ip_bonus"
>;

export type JobFeatureFilterKey = AllowanceKey | BonusKey;

const BONUS_KEYS: readonly BonusKey[] = ["hp_bonus", "mp_bonus", "ip_bonus"];

export function isJobAllowanceEnabled(value: JobFlagValue): boolean {
  return value === true || value === 1 || value === "1";
}

export function getPositiveJobBonus(value: JobBonusValue): number {
  const bonus = Number(value);

  return Number.isFinite(bonus) && bonus > 0 ? bonus : 0;
}

export function isJobBonusKey(
  key: JobFeatureFilterKey,
): key is BonusKey {
  return BONUS_KEYS.includes(key as BonusKey);
}

export function jobMatchesFeatureFilter(
  job: JobCatalogItem,
  key: JobFeatureFilterKey,
): boolean {
  if (isJobBonusKey(key)) {
    return getPositiveJobBonus(job[key]) > 0;
  }

  return isJobAllowanceEnabled(job[key]);
}