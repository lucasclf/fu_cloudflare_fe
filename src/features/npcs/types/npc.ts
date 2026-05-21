export type NpcNullableValue = string | number | null | undefined;

export type NpcSummary = {
  id: number;
  name: string;
  tagline: string | null;
  level: number | null;
  dexterity_die: string | null;
  insight_die: string | null;
  might_die: string | null;
  willpower_die: string | null;
  img_key: string | null;
};

export type NpcSpecialRule = {
  id: number;
  npc_id: number;
  type: string;
  title: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string | null;
};

export type NpcInventoryItem = {
  npc_id: number;
  item: NpcItem;
  relation_type: string;
  quantity: number | null;
};

export type NpcEquipmentItem = {
  npc_id: number;
  item: NpcItem;
  slot: string;
};

export type NpcDetail = NpcSummary & {
  description: string | null;
  hp: number | null;
  mp: number | null;
  initiative: number | null;
  defense: number | null;
  magic_defense: number | null;
  created_at: string;
  updated_at: string | null;
  specialRules: NpcSpecialRule[];
  inventory: NpcInventoryItem[];
  equipment: NpcEquipmentItem[];
};

export type NpcItem = {
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