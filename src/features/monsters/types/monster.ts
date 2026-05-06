export type MonsterSummary = {
  id: number;
  name: string;
  level: number;
  monster_type: string;
  dexterity_die: string;
  insight_die: string;
  might_die: string;
  willpower_die: string;
  img_key: string | null;
};

export type MonsterTrait = {
  monster_id: number;
  trait: string;
};

export type MonsterAffinityValue =
  | "normal"
  | "vulnerable"
  | "resistant"
  | "immune"
  | "absorbs"
  | string
  | null;

export type MonsterAffinity = {
  monster_id: number;
  physical: MonsterAffinityValue;
  air: MonsterAffinityValue;
  bolt: MonsterAffinityValue;
  dark: MonsterAffinityValue;
  earth: MonsterAffinityValue;
  fire: MonsterAffinityValue;
  ice: MonsterAffinityValue;
  light: MonsterAffinityValue;
  poison: MonsterAffinityValue;
};

export type MonsterAction = {
  id: number;
  monster_id: number;
  action_type: string;
  action_icon: string | null;
  name: string;
  description: string;
  check_formula: string | null;
  accuracy_bonus: number | null;
  damage_type: string | null;
  cost: string | null;
  target: string | null;
  duration: string | null;
  is_offensive: boolean | 0 | 1 | "0" | "1" | null;
};

export type MonsterDetail = MonsterSummary & {
  description: string | null;
  hp: number;
  crisis_hp: number;
  mp: number;
  initiative: number;
  defense: number;
  magic_defense: number;
  created_at: string;
  updated_at: string | null;
  traits: MonsterTrait[];
  affinities: MonsterAffinity[];
  actions: MonsterAction[];
};