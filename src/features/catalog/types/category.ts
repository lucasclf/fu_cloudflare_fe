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