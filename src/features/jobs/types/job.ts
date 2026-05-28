export type JobFlagValue = boolean | number | string | null | undefined;

export type JobBonusValue = number | string | null | undefined;

export type JobCatalogItem = {
  id: number;
  name: string;
  tagline: string | null;
  imageKey: string | null;

  allowsMartialArmor: JobFlagValue;
  allowsMartialShield: JobFlagValue;
  allowsMartialRangedWeapon: JobFlagValue;
  allowsMartialMeleeWeapon: JobFlagValue;
  allowsArcane: JobFlagValue;
  allowsRituals: JobFlagValue;
  canStartProjects: JobFlagValue;

  hpBonus: JobBonusValue;
  mpBonus: JobBonusValue;
  ipBonus: JobBonusValue;
};

export type Job = JobCatalogItem & {
  aliases?: JobAlias[];
  questions?: JobQuestion[];
  powers?: JobPower[];
  spells?: JobSpell[];
  arcanas?: JobArcana[];
};

export type JobAlias = {
  id: number;
  alias?: string | null;
  name?: string | null;
};

export type JobQuestion = {
  id: number;
  question?: string | null;
  text?: string | null;
  description?: string | null;
};

export type JobPower = {
  id: number;
  name: string;
  type?: string | null;
  maxLevel?: number | string | null;
  isGlobal?: boolean | number | string | null;
  description: string;
};

export type JobSpell = {
  id: number;
  name: string;
  description: string;
  type?: string | null;
  cost?: string | number | null;
  mpCost?: string | number | null;
  target?: string | number | null;
  duration?: string | number | null;
  isOffensive?: boolean | number | string | null;
};

export type JobArcana = {
  id: number;
  name: string;
  domain: string;
  mergeEffect: string | null;
  dismissEffect: string | null;
  specialRule: string | null;
};
