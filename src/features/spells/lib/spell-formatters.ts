import type { SpellFlagValue } from "../types/spell";

export function normalizeSpellText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isSpellOffensive(value: SpellFlagValue): boolean {
  return value === true || value === 1 || value === "1";
}

export function renderSpellValue(value: string | null): string {
  if (value === null || value.trim().length === 0) {
    return "—";
  }

  return value;
}