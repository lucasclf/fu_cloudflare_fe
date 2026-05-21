import type { AttributeGridItem } from "../../../shared/components/attribute-grid";
import type { Item } from "../types/item";
import {
  formatItemDamageWithType,
  formatItemDefenseValue,
  formatItemDistanceValue,
  formatItemGripValue,
  formatNullableItemValue,
  hasTextContent,
} from "./item-formatters";

export type ItemAttributesConfig = {
  columns: 2 | 3;
  items: AttributeGridItem[];
};

export function getItemAttributes(item: Item): ItemAttributesConfig {
  if (item.item_type === "arma") {
    return {
      columns: 2,
      items: getWeaponAttributes(item),
    };
  }

  if (item.item_type === "armadura" || item.item_type === "escudo") {
    return {
      columns: 3,
      items: getEquipmentAttributes(item),
    };
  }

  return {
    columns: 2,
    items: getDescriptionAttributes(item),
  };
}

function getWeaponAttributes(item: Item): AttributeGridItem[] {
  const attributes: AttributeGridItem[] = [
    {
      label: "Dano",
      value: formatItemDamageWithType(item.damage, item.damage_type),
    },
    {
      label: "Precisão",
      value: formatNullableItemValue(item.accuracy),
    },
    {
      label: "Empunhadura",
      value: formatItemGripValue(item.grip),
    },
    {
      label: "Alcance",
      value: formatItemDistanceValue(item.distance),
    },
  ];

  if (hasDefenseValue(item)) {
    attributes.push({
      label: "Defesa",
      value: formatItemDefenseValue(item.defense_dice, item.defense_bonus),
    });
  }

  if (hasMagicDefenseValue(item)) {
    attributes.push({
      label: "Defesa mágica",
      value: formatItemDefenseValue(
        item.magic_defense_dice,
        item.magic_defense_bonus,
      ),
    });
  }

  if (hasTextContent(item.description)) {
    attributes.push({
      label: "Especial",
      value: item.description,
      fullWidth: true,
    });
  }

  return attributes;
}

function getEquipmentAttributes(item: Item): AttributeGridItem[] {
  const attributes: AttributeGridItem[] = [
    {
      label: "Defesa",
      value: formatItemDefenseValue(item.defense_dice, item.defense_bonus),
    },
    {
      label: "Defesa Mágica",
      value: formatItemDefenseValue(
        item.magic_defense_dice,
        item.magic_defense_bonus,
      ),
    },
    {
      label: "Iniciativa",
      value: formatNullableItemValue(item.initiative),
    },
  ];

  if (hasTextContent(item.description)) {
    attributes.push({
      label: "Especial",
      value: item.description,
      fullWidth: true,
    });
  }

  return attributes;
}

function getDescriptionAttributes(item: Item): AttributeGridItem[] {
  return [
    {
      label: "Descrição",
      value: formatNullableItemValue(item.description),
      fullWidth: true,
    },
  ];
}

function hasDefenseValue(item: Item): boolean {
  return item.defense_bonus !== null || item.defense_dice !== null;
}

function hasMagicDefenseValue(item: Item): boolean {
  return item.magic_defense_bonus !== null || item.magic_defense_dice !== null;
}