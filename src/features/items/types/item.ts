export type ItemType =
  | "arma"
  | "armadura"
  | "escudo"
  | "acessorio"
  | "artefato"
  | "outros";

export type WeaponCategory =
  | "arcana"
  | "arco"
  | "luta"
  | "adaga"
  | "arma_de_fogo"
  | "malho"
  | "pesado"
  | "lança"
  | "espada"
  | "arremesso";

export type DamageType =
  | "fisico"
  | "fogo"
  | "gelo"
  | "raio"
  | "terra"
  | "ar"
  | "luz"
  | "trevas"
  | "veneno"
  | null;

export type GripType = "uma_mao" | "duas_maos" | null;
export type DistanceType = "corpo_a_corpo" | "a_distancia" | null;

export type Item = {
  id: number;
  name: string;
  item_type: ItemType;
  img_key: string | null;

  weapon_category: WeaponCategory | null;
  damage: string | null;
  accuracy: string | null;
  damage_type: DamageType;
  grip: GripType;
  distance: DistanceType;

  defense: string | null;
  magic_defense: string | null;
  initiative: string | null;

  cost: number | null;
  is_martial: boolean | null;
  description: string | null;

  created_at: string;
  updated_at: string | null;
};

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  arma: "Armas",
  armadura: "Armaduras",
  escudo: "Escudos",
  acessorio: "Acessórios",
  artefato: "Artefatos",
  outros: "Outros",
};

export const ITEM_TYPE_OPTIONS: ItemType[] = [
  "arma",
  "armadura",
  "escudo",
  "acessorio",
  "artefato",
  "outros",
];