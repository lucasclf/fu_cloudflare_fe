import { formatDamageType } from "@/shared/lib/text-formatters";

export function formatItemDefenseValue(
  dice: string | null | undefined,
  bonus: number | string | null | undefined,
): string {
  const normalizedDice = dice?.trim();
  const normalizedBonus = normalizeItemBonus(bonus);

  const hasDice = Boolean(normalizedDice);
  const hasBonus = normalizedBonus !== null && normalizedBonus !== 0;

  if (hasDice && hasBonus) {
    return `${normalizedDice} ${formatSignedBonus(normalizedBonus)}`;
  }

  if (hasDice) {
    return normalizedDice!;
  }

  if (hasBonus) {
    return String(normalizedBonus);
  }

  return "???";
}

export function formatNullableItemValue(
  value: string | number | null | undefined,
  fallback = "—",
): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

export function formatItemCategoryBadgeValue(
  value: string | null | undefined,
): string | null {
  if (!hasTextContent(value)) {
    return null;
  }

  const normalized = value.replaceAll("_", " ");

  return capitalizeFirstLetter(normalized);
}

export function formatItemDamageWithType(
  damage: string | null,
  damageType: string | null,
): string {
  const resolvedDamage = formatNullableItemValue(damage);

  if (!hasTextContent(damageType)) {
    return resolvedDamage;
  }

  return `${resolvedDamage} | ${formatDamageType(damageType)}`;
}

export function formatItemCapitalizedValue(
  value: string | null | undefined,
): string {
  if (!hasTextContent(value)) {
    return "—";
  }

  return capitalizeFirstLetter(value);
}

export function formatItemGripValue(value: string | null | undefined): string {
  if (value === "uma_mao") {
    return "Uma Mão";
  }

  if (value === "duas_maos") {
    return "Duas Mãos";
  }

  return formatNullableItemValue(value);
}

export function formatItemDistanceValue(
  value: string | null | undefined,
): string {
  if (value === "corpo_a_corpo") {
    return "Corpo a Corpo";
  }

  if (value === "distancia" || value === "a_distancia") {
    return "Distância";
  }

  return formatNullableItemValue(value);
}

export function hasTextContent(
  value: string | null | undefined,
): value is string {
  return value !== null && value !== undefined && value.trim().length > 0;
}

function normalizeItemBonus(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatSignedBonus(value: number): string {
  if (value > 0) {
    return `+ ${value}`;
  }

  return `- ${Math.abs(value)}`;
}

function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
