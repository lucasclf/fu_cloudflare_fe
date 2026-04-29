export type SpellFlagValue = boolean | 0 | 1 | "0" | "1" | null | undefined;

export type Spell = {
  id: number;
  job_id: number;
  job_name: string;
  name: string;
  description: string | null;
  is_offensive: SpellFlagValue;
  cost: string | null;
  target: string | null;
  duration: string | null;
};