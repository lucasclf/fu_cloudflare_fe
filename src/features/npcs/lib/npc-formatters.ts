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

export function formatNpcItemType(type: string): string {
  const labels: Record<string, string> = {
    arma: "Arma",
    armadura: "Armadura",
    escudo: "Escudo",
    acessorio: "Acessório",
    consumivel: "Consumível",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatNpcItemValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "???";
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  return String(value);
}

export function formatNpcCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "???";
  }

  return `${value} zenit`;
}

export function formatMartialValue(value: boolean | null): string {
  if (value === null) {
    return "???";
  }

  return value ? "Marcial" : "Não marcial";
}

export function formatWeaponGrip(value: string | null): string {
  const labels: Record<string, string> = {
    uma_mao: "Uma mão",
    duas_maos: "Duas mãos",
  };

  if (!value) {
    return "???";
  }

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatWeaponDistance(value: string | null): string {
  const labels: Record<string, string> = {
    corpo_a_corpo: "Corpo a corpo",
    distancia: "À distância",
  };

  if (!value) {
    return "???";
  }

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatDamageType(value: string | null): string {
  const labels: Record<string, string> = {
    fisico: "Físico",
    fogo: "Fogo",
    gelo: "Gelo",
    raio: "Raio",
    ar: "Ar",
    terra: "Terra",
    luz: "Luz",
    trevas: "Trevas",
    veneno: "Veneno",
  };

  if (!value) {
    return "???";
  }

  return labels[value] ?? formatFallbackLabel(value);
}

function formatFallbackLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}