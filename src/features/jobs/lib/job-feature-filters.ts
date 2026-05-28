import type { JobBonusValue, JobCatalogItem, JobFlagValue } from "../types/job";

export type AllowanceKey = keyof Pick<
  JobCatalogItem,
  | "allowsMartialArmor"
  | "allowsMartialShield"
  | "allowsMartialRangedWeapon"
  | "allowsMartialMeleeWeapon"
  | "allowsArcane"
  | "allowsRituals"
  | "canStartProjects"
>;

export type BonusKey = keyof Pick<
  JobCatalogItem,
  "hpBonus" | "mpBonus" | "ipBonus"
>;

export type JobFeatureFilterKey = AllowanceKey | BonusKey;

const BONUS_KEYS: readonly BonusKey[] = ["hpBonus", "mpBonus", "ipBonus"];

export function isJobAllowanceEnabled(value: JobFlagValue): boolean {
  return value === true || value === 1 || value === "1";
}

export function getPositiveJobBonus(value: JobBonusValue): number {
  const bonus = Number(value);

  return Number.isFinite(bonus) && bonus > 0 ? bonus : 0;
}

export function isJobBonusKey(key: JobFeatureFilterKey): key is BonusKey {
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
