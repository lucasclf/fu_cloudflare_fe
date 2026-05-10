export type JobFlagValue = boolean | 0 | 1 | "0" | "1" | null | undefined;

export type JobBonusValue = number | string | null | undefined;

export type JobCatalogItem = {
  id: number;
  name: string;
  tagline: string | null;
  img_key: string | null;

  allows_martial_armor?: JobFlagValue;
  allows_martial_shield?: JobFlagValue;
  allows_martial_ranged_weapon?: JobFlagValue;
  allows_martial_melee_weapon?: JobFlagValue;
  allows_arcane?: JobFlagValue;
  allows_rituals?: JobFlagValue;
  can_start_projects?: JobFlagValue;
  hp_bonus?: JobBonusValue;
  mp_bonus?: JobBonusValue;
  ip_bonus?: JobBonusValue;
};

export type JobQuestion = {
  id: number;
  job_id?: number;
  question?: string | null;
  text?: string | null;
  description?: string | null;
  sort_order?: number | null;
  created_at?: string;
  updated_at?: string | null;
};

export type JobAlias = {
  id: number;
  job_id?: number;
  alias?: string | null;
  name?: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type JobPower = {
  id: number;
  job_id?: number;
  name: string;
  description: string;
  type: string | null;
  max_level: number | null;
  created_at?: string;
  updated_at?: string | null;
};

export type JobSpell = {
  id: number;
  job_id?: number;
  name: string;
  description: string;
  mp_cost?: string | number | null;
  target?: string | null;
  duration?: string | null;
  type?: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type Job = JobCatalogItem & {
  questions?: JobQuestion[];
  aliases?: JobAlias[];
  powers?: JobPower[];
  spells?: JobSpell[];
  arcanas?: JobArcana[];
  created_at?: string;
  updated_at?: string | null;
};

export type JobArcana = {
  id: number;
  name: string;
  domain: string;
  merge_effect?: string | null;
  dismiss_effect?: string | null;
  special_rule?: string | null;
};