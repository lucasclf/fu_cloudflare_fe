export type CampaignRole = "master" | "player";
export type CampaignStatus = "active" | "hiatus" | "completed";

export type UserCampaignDto = {
  id: number;
  name: string;
  description: string | null;
  img_key: string | null;
  status: CampaignStatus;
  role: CampaignRole;
  joined_at: string;
};

export type UserCampaign = {
  id: number;
  name: string;
  description: string | null;
  imgKey: string | null;
  status: CampaignStatus;
  role: CampaignRole;
  joinedAt: string;
};

export type CreateCampaignInput = {
  name: string;
  description?: string | null;
};

export type CreatedCampaign = {
  id: number;
  message: string;
};

// ─── Campaign Home ──────────────────────────────────────────────────────────

export type CampaignSummary = {
  id: number;
  name: string;
  description: string | null;
  img_key: string | null;
  status: CampaignStatus;
  master_notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type CampaignSummaryPlayer = Omit<CampaignSummary, "master_notes">;

export type HomeStats = {
  memberCount: number;
  sessionCount: number;
  npcCount: number;
  locationCount: number;
  factionCount: number;
  monsterCount: number;
  pcCount: number;
};

export type MemberWithNickname = {
  user_id: number;
  role: CampaignRole;
  nickname: string;
  pc_id: number | null;
  pc_name: string | null;
};

export type RecentSession = {
  id: number;
  session_number: number;
  title: string | null;
  played_at: string;
};

export type Session = {
  id: number;
  campaign_id: number;
  session_number: number;
  title: string | null;
  summary: string;
  notes: string | null;
  played_at: string;
  created_at: string;
  updated_at: string | null;
};

export type PendingInvitation = {
  id: number;
  invitee_id: number;
  invitee_nickname: string;
  created_at: string;
};

export type PcHomeStats = {
  id: number;
  name: string;
  tagline: string | null;
  img_key: string | null;
  level: number;
  hp: number;
  mp: number;
  initiative: number;
  ip: number;
  defense: number;
  magic_defense: number;
  jobs: { name: string; level: number }[];
};

export type CampaignHomeMaster = {
  role: "master";
  campaign: CampaignSummary;
  stats: HomeStats;
  members: MemberWithNickname[];
  recentSessions: RecentSession[];
  pendingInvitations: PendingInvitation[];
};

export type CampaignHomePlayer = {
  role: "player";
  campaign: CampaignSummaryPlayer;
  masterNickname: string;
  memberCount: number;
  myPcs: PcHomeStats[];
  recentSessions: RecentSession[];
};

export type CampaignHome = CampaignHomeMaster | CampaignHomePlayer;

export type UserSearchResult = {
  id: number;
  nickname: string;
  email: string;
};

// ─── Entity Creation Inputs ───────────────────────────────────────────────────

export type AttributeDie = "d6" | "d8" | "d10" | "d12";

export type CreateSessionInput = {
  session_number: number;
  title?: string | null;
  summary: string;
  notes?: string | null;
  played_at: string;
  visible_to_players: boolean;
};

export type NpcSpecialRuleType =
  | "bonus"
  | "attack"
  | "penalty"
  | "passive"
  | "reaction"
  | "condition"
  | "note";

export type NpcInventoryRelationType = "inventory" | "shop_stock";

export type CreateNpcSpecialRuleInput = {
  type: NpcSpecialRuleType;
  title: string;
  description: string;
  metadata?: Record<string, unknown> | null;
};

export type CreateNpcInventoryItemInput = {
  item_id: number;
  relation_type: NpcInventoryRelationType;
  quantity: number;
};

export type CreateNpcEquipmentInput = {
  main_hand?: number | null;
  off_hand?: number | null;
  armor?: number | null;
  accessory?: number | null;
};

export type CreateNpcInput = {
  name: string;
  description: string;
  tagline?: string | null;
  level?: number | null;
  dexterity_die?: AttributeDie | null;
  insight_die?: AttributeDie | null;
  might_die?: AttributeDie | null;
  willpower_die?: AttributeDie | null;
  hp?: number | null;
  mp?: number | null;
  initiative?: number | null;
  defense?: number | null;
  magic_defense?: number | null;
  img_key?: string | null;
  visible_to_players: boolean;
  specialRules?: CreateNpcSpecialRuleInput[];
  inventory?: CreateNpcInventoryItemInput[];
  equipment?: CreateNpcEquipmentInput | null;
};

export type BondTargetType = "pc" | "npc" | "monster" | "freeform";
export type AdmirationAxis = "admiration" | "inferiority";
export type LoyaltyAxis = "loyalty" | "mistrust";
export type AffectionAxis = "affection" | "hatred";

export type CreatePcBondInput = {
  target_type: BondTargetType;
  target_id?: number | null;
  target_name?: string | null;
  admiration_axis?: AdmirationAxis | null;
  loyalty_axis?: LoyaltyAxis | null;
  affection_axis?: AffectionAxis | null;
  description?: string | null;
};

export type CreatePcJobInput = {
  job_id: number;
  level: number;
  ignore_hp_bonus: boolean;
  ignore_mp_bonus: boolean;
};

export type CreatePcPowerInput = {
  power_id: number;
  level: number;
};

export type CreatePcInventoryInput = {
  item_id: number;
  quantity: number;
};

export type CreatePcEquipmentInput = {
  main_hand?: number | null;
  off_hand?: number | null;
  armor?: number | null;
  accessory?: number | null;
};

export type CreatePcInput = {
  name: string;
  description: string;
  tagline?: string | null;
  pronouns?: string | null;
  origin: string;
  identity: string;
  theme: string;
  money?: number;
  dexterity_die: AttributeDie;
  insight_die: AttributeDie;
  might_die: AttributeDie;
  willpower_die: AttributeDie;
  jobs?: CreatePcJobInput[];
  powers?: CreatePcPowerInput[];
  spells?: number[];
  equipment?: CreatePcEquipmentInput | null;
  inventory?: CreatePcInventoryInput[];
  bonds?: CreatePcBondInput[];
};

export type LocationType =
  | "region" | "city" | "village" | "dungeon"
  | "landmark" | "building" | "other";

export type CreateLocationInput = {
  name: string;
  tagline: string;
  description: string;
  img_key: string | null;
  location_type: LocationType;
  visible_to_players: boolean;
};

export type FactionType =
  | "guild" | "kingdom" | "order" | "cult" | "clan"
  | "company" | "criminal" | "military" | "other";

export type FactionLocationRelationType =
  | "headquarters" | "origin" | "territory" | "influence"
  | "presence" | "enemy_presence" | "other";

export type FactionLocationRelation = {
  location_id: number;
  relation_type: FactionLocationRelationType;
};

export type CreateFactionInput = {
  name: string;
  tagline: string;
  description: string;
  img_key: string | null;
  faction_type: FactionType;
  faction_location_relation: FactionLocationRelation[];
  visible_to_players: boolean;
};

export type LocationOption = {
  id: number;
  name: string;
};

export type MonsterType =
  | "construct" | "demon" | "elemental" | "beast"
  | "humanoid" | "monster" | "undead" | "plant";

export type MonsterAffinityType =
  | "normal" | "vulnerable" | "resistant" | "immune" | "absorbs";

export type MonsterActionType =
  | "basic_attack" | "spell" | "other_action" | "special_rule";

export type MonsterActionIcon =
  | "melee" | "ranged" | "spell" | "support" | "passive";

export type CreateMonsterAffinitiesInput = Record<DamageType, MonsterAffinityType>;

export type CreateMonsterActionInput = {
  action_type: MonsterActionType;
  action_icon?: MonsterActionIcon | null;
  name: string;
  description: string;
  check_formula?: string | null;
  accuracy_bonus?: number | null;
  damage_type?: DamageType | null;
  cost?: string | null;
  target?: string | null;
  duration?: string | null;
  is_offensive?: boolean;
};

export type CreateMonsterInput = {
  name: string;
  description: string;
  monster_type: MonsterType;
  level: number;
  dexterity_die: AttributeDie;
  insight_die: AttributeDie;
  might_die: AttributeDie;
  willpower_die: AttributeDie;
  hp: number;
  mp: number;
  initiative: number;
  defense: number;
  magic_defense: number;
  is_villain?: boolean;
  ultima_points?: number;
  traits: { trait: string }[];
  affinities?: CreateMonsterAffinitiesInput;
  actions: CreateMonsterActionInput[];
  visible_to_players: boolean;
};

export type ItemType =
  | "arma" | "armadura" | "escudo"
  | "acessorio" | "artefato" | "outros";

export type WeaponCategory =
  | "arcana" | "arco" | "luta" | "adaga" | "arma_de_fogo"
  | "malho" | "pesado" | "lança" | "espada" | "arremesso";

export type DamageType =
  | "physical" | "air" | "bolt" | "dark"
  | "earth" | "fire" | "ice" | "light" | "poison";

export type UpdateItemInput = CreateItemInput;

export type CreateItemInput = {
  name: string;
  item_type: ItemType;
  description?: string | null;
  img_key?: string | null;
  cost?: number | null;
  weapon_category?: WeaponCategory | null;
  accuracy?: string | null;
  damage?: string | null;
  damage_type?: DamageType | null;
  grip?: string | null;
  distance?: string | null;
  defense_dice?: string | null;
  defense_bonus?: number | null;
  magic_defense_dice?: string | null;
  magic_defense_bonus?: number | null;
  initiative?: string | null;
  is_martial?: boolean | null;
  visible_to_players: boolean;
};
