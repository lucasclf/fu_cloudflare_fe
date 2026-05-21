export type SpellFlagValue = boolean | 0 | 1 | "0" | "1" | null | undefined;

export type SpellNature = "job" | "monster";

export type Spell = {
  id: number;
  job_id?: number | null;
  job_name?: string | null;
  nature: SpellNature;
  name: string;
  description: string | null;
  is_offensive: SpellFlagValue;
  cost: string | null;
  target: string | null;
  duration: string | null;
};