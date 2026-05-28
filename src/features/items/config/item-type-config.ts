import type { ItemType } from "../types/item";

export const ITEM_TYPE_OPTIONS = [
  "arma",
  "armadura",
  "escudo",
  "acessorio",
  "artefato",
  "outros",
] as const satisfies readonly ItemType[];

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  arma: "Armas",
  armadura: "Armaduras",
  escudo: "Escudos",
  acessorio: "Acessórios",
  artefato: "Artefatos",
  outros: "Outros",
};
