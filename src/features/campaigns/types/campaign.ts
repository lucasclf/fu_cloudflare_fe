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
};

export type LocationType =
  | "region" | "city" | "village" | "dungeon"
  | "landmark" | "building" | "other";

export type CreateLocationInput = {
  name: string;
  tagline: string;
  description: string;
  location_type: LocationType;
};

export type FactionType =
  | "guild" | "kingdom" | "order" | "cult" | "clan"
  | "company" | "criminal" | "military" | "other";

export type CreateFactionInput = {
  name: string;
  tagline: string;
  description: string;
  faction_type: FactionType;
};

export type MonsterType =
  | "construct" | "demon" | "elemental" | "beast"
  | "humanoid" | "monster" | "undead" | "plant";

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
};

export type ItemType =
  | "arma" | "armadura" | "escudo"
  | "acessorio" | "artefato" | "outros";

export type CreateItemInput = {
  name: string;
  item_type: ItemType;
  description?: string | null;
  cost?: number | null;
};
