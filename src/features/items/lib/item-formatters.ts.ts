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