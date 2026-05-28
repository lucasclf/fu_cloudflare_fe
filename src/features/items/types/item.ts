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
  itemType: ItemType;
  imageKey: string | null;
  weaponCategory: WeaponCategory | null;
  damage: string | null;
  accuracy: string | null;
  damageType: DamageType;
  grip: GripType;
  distance: DistanceType;
  defenseDice: string | null;
  defenseBonus: number | null;
  magicDefenseDice: string | null;
  magicDefenseBonus: number | null;
  initiative: string | null;
  cost: number | null;
  isMartial: boolean | null;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
};
