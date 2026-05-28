import type { JobBonusValue, JobFlagValue } from "./job";

export type JobCatalogItemDto = {
  id: number;
  name: string;
  tagline: string | null;
  img_key: string | null;

  allows_martial_armor: JobFlagValue;
  allows_martial_shield: JobFlagValue;
  allows_martial_ranged_weapon: JobFlagValue;
  allows_martial_melee_weapon: JobFlagValue;
  allows_arcane: JobFlagValue;
  allows_rituals: JobFlagValue;
  can_start_projects: JobFlagValue;

  hp_bonus: JobBonusValue;
  mp_bonus: JobBonusValue;
  ip_bonus: JobBonusValue;
};

export type JobDto = JobCatalogItemDto & {
  aliases?: JobAliasDto[];
  questions?: JobQuestionDto[];
  powers?: JobPowerDto[];
  spells?: JobSpellDto[];
  arcanas?: JobArcanaDto[];
};

export type JobAliasDto = {
  id: number;
  alias?: string | null;
  name?: string | null;
};

export type JobQuestionDto = {
  id: number;
  question?: string | null;
  text?: string | null;
  description?: string | null;
};

export type JobPowerDto = {
  id: number;
  name: string;
  type?: string | null;
  max_level?: number | string | null;
  is_global?: boolean | number | string | null;
  description: string;
};

export type JobSpellDto = {
  id: number;
  name: string;
  description: string;
  type?: string | null;
  cost?: string | number | null;
  mp_cost?: string | number | null;
  target?: string | number | null;
  duration?: string | number | null;
  is_offensive?: boolean | number | string | null;
};

export type JobArcanaDto = {
  id: number;
  name: string;
  domain: string;
  merge_effect: string | null;
  dismiss_effect: string | null;
  special_rule: string | null;
};
