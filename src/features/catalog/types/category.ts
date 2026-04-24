export type CatalogCategory =
  | "sessions"
  | "items"
  | "characters"
  | "npcs"
  | "bestiary"
  | "villains"
  | "spells"
  | "classes"
  | "places";

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  sessions: "Sessões",
  items: "Itens",
  characters: "Jogadores",
  npcs: "NPC's",
  bestiary: "Bestiário",
  villains: "Vilões",
  spells: "Magias",
  classes: "Classes",
  places: "Locais",
};