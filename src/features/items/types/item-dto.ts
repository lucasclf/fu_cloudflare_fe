export type ItemTypeDto =
  | "arma"
  | "armadura"
  | "escudo"
  | "acessorio"
  | "artefato"
  | "outros";

export type WeaponCategoryDto =
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

export type DamageTypeDto =
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

export type GripTypeDto = "uma_mao" | "duas_maos" | null;

export type DistanceTypeDto = "corpo_a_corpo" | "a_distancia" | null;

export type ItemDto = {
  id: number;
  name: string;
  item_type: ItemTypeDto;
  img_key: string | null;
  weapon_category: WeaponCategoryDto | null;
  damage: string | null;
  accuracy: string | null;
  damage_type: DamageTypeDto;
  grip: GripTypeDto;
  distance: DistanceTypeDto;
  defense_dice: string | null;
  defense_bonus: number | null;
  magic_defense_dice: string | null;
  magic_defense_bonus: number | null;
  initiative: string | null;
  cost: number | null;
  is_martial: boolean | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
};
