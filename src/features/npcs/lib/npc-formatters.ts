import type { NpcNullableValue } from "../types/npc";

export function normalizeNpcText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function renderNpcValue(value: NpcNullableValue): string {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "???";
  }

  return String(value);
}

export function formatSpecialRuleType(type: string): string {
  const labels: Record<string, string> = {
    passive: "Passiva",
    penalty: "Penalidade",
    active: "Ativa",
    reaction: "Reação",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatInventoryRelationType(type: string): string {
  const labels: Record<string, string> = {
    shop_stock: "Estoque da loja",
    personal_item: "Item pessoal",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatEquipmentSlot(slot: string): string {
  const labels: Record<string, string> = {
    main_hand: "Mão principal",
    off_hand: "Mão secundária",
    armor_slot: "Armadura",
    accessory_slot: "Acessório",
  };

  return labels[slot] ?? formatFallbackLabel(slot);
}

function formatFallbackLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}