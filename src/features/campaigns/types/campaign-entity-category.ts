import type { CatalogCategory } from "@/features/catalog/types/category";
import { CATEGORY_LABELS } from "@/features/catalog/types/category";

export type CampaignEntityCategory = CatalogCategory | "sessions" | "arcanas";

export const CAMPAIGN_ENTITY_CATEGORIES = [
  "items",
  "characters",
  "npcs",
  "bestiary",
  "spells",
  "powers",
  "classes",
  "scenario",
  "sessions",
  "arcanas",
] as const satisfies readonly CampaignEntityCategory[];

export const CAMPAIGN_ENTITY_CATEGORY_LABELS: Record<CampaignEntityCategory, string> = {
  ...CATEGORY_LABELS,
  sessions: "Sessões",
  arcanas: "Arcanas",
};

export const CAMPAIGN_ENTITY_CATEGORY_OPTIONS = CAMPAIGN_ENTITY_CATEGORIES.map((category) => ({
  value: category,
  label: CAMPAIGN_ENTITY_CATEGORY_LABELS[category],
}));
