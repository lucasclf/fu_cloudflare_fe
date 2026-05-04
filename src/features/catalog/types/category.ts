export type CatalogCategory =
  | "sessions"
  | "items"
  | "characters"
  | "npcs"
  | "bestiary"
  | "villains"
  | "spells"
  | "powers"
  | "classes"
  | "scenario";

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  sessions: "Sessões",
  items: "Itens",
  characters: "Jogadores",
  npcs: "NPC's",
  bestiary: "Bestiário",
  villains: "Vilões",
  spells: "Magias",
  powers: "Poderes",
  classes: "Classes",
  scenario: "Cenário",
};