export type PcSummary = {
  id: number;
  name: string;
  tagline: string | null;
  dexterity_die: string | null;
  insight_die: string | null;
  might_die: string | null;
  willpower_die: string | null;
  img_key: string | null;
};

export type PcStats = {
  level: number;
  hp: number;
  mp: number;
  initiative: number;
  ip: number;
  defense: number;
  magic_defense: number;
};

export type PcCapacities = {
  hp_bonus: number;
  mp_bonus: number;
  ip_bonus: number;
  allows_martial_armor: boolean;
  allows_martial_shield: boolean;
  allows_martial_ranged_weapon: boolean;
  allows_martial_melee_weapon: boolean;
  allows_arcane: boolean;
  allows_rituals: boolean;
  allows_monster_spells: boolean;
  can_start_projects: boolean;
};

export type PcJob = {
  id: number;
  name: string;
  tagline: string | null;
  img_key: string | null;
  hp_bonus: number;
  mp_bonus: number;
  ip_bonus: number;
  allows_martial_armor: boolean;
  allows_martial_shield: boolean;
  allows_martial_ranged_weapon: boolean;
  allows_martial_melee_weapon: boolean;
  allows_arcane: boolean;
  allows_rituals: boolean;
  allows_monster_spells: boolean;
  can_start_projects: boolean;
  level: number;
};

export type PcPower = {
  id: number;
  name: string;
  description: string;
  type: "common" | "heroic" | string;
  max_level: number;
  is_global: boolean;
  level: number;
};

export type PcSpell = {
  id: number;
  job_id?: number | null;
  monster_id?: number | null;
  action_type?: string | null;
  action_icon?: string | null;
  name: string;
  description: string;
  check_formula?: string | null;
  accuracy_bonus?: number | null;
  damage_type?: string | null;
  is_offensive: boolean | 0 | 1 | "0" | "1" | null;
  cost: string | null;
  target: string | null;
  duration: string | null;
  nature?: "job" | "monster" | string;
};

export type PcArcana = {
  id: number;
  job_id: number;
  name: string;
  description: string;
  is_offensive: boolean | 0 | 1 | "0" | "1" | null;
  cost: string | null;
  target: string | null;
  duration: string | null;
};

export type PcItem = {
  id: number;
  name: string;
  item_type: string;
  description: string | null;
  img_key: string | null;
  cost: number | null;
  weapon_category: string | null;
  accuracy: string | null;
  damage: string | null;
  damage_type: string | null;
  grip: string | null;
  distance: string | null;
  defense_dice: string | null;
  defense_bonus: number | null;
  magic_defense_dice: string | null;
  magic_defense_bonus: number | null;
  initiative: string | null;
  is_martial: boolean | null;
  created_at: string;
  updated_at: string | null;
};

export type PcEquipment = {
  pc_id: number;
  main_hand: PcItem | null;
  off_hand: PcItem | null;
  armor: PcItem | null;
  accessory: PcItem | null;
};

export type PcInventoryItem = {
  pc_id: number;
  item: PcItem;
  quantity: number | null;
};

export type PcBond = {
  pc_id: number;
  target_type: string;
  target_id: number | null;
  target_name: string | null;
  admiration_axis: string | null;
  loyalty_axis: string | null;
  affection_axis: string | null;
  description: string | null;
};

export type PcDetail = PcSummary & {
  description: string | null;
  pronouns: string | null;
  origin: string | null;
  identity: string | null;
  theme: string | null;
  money: number | null;
  created_at: string;
  updated_at: string | null;
  stats: PcStats;
  pc_capacities: PcCapacities;
  jobs: PcJob[];
  powers: PcPower[];
  spells: PcSpell[];
  monsterSpells: PcSpell[];
  arcanas: PcArcana[];
  equipment: PcEquipment;
  inventories: PcInventoryItem[];
  bonds: PcBond[];
};