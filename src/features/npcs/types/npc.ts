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
  item_id: number;
  relation_type: string;
  quantity: number | null;
};

export type NpcEquipmentItem = {
  npc_id: number;
  item_id: number;
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