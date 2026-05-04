export type PowerType = "common" | "heroic";

export type Power = {
  id: number;
  name: string;
  description: string;
  type: PowerType;
  max_level: number;
  is_global: boolean;
  job_name: string[];
};