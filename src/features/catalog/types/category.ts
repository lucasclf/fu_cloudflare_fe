export type CatalogCategory =
  | "sessions"
  | "items"
  | "characters"
  | "npcs"
  | "bestiary"
  | "spells"
  | "powers"
  | "classes"
  | "scenario";

export const CATALOG_CATEGORIES = [
  "sessions",
  "items",
  "characters",
  "npcs",
  "bestiary",
  "spells",
  "powers",
  "classes",
  "scenario",
] as const satisfies readonly CatalogCategory[];

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  sessions: "Sessões",
  items: "Itens",
  characters: "PC's",
  npcs: "NPC's",
  bestiary: "Bestiário",
  spells: "Magias",
  powers: "Poderes",
  classes: "Classes",
  scenario: "Cenário",
};

export const CATALOG_CATEGORY_OPTIONS = CATALOG_CATEGORIES.map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}));
