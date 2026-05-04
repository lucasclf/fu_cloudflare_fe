import type { Spell, SpellFlagValue } from "../types/spell";

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

export function getSpellSourceName(spell: Spell): string {
  if (spell.nature === "monster") {
    return "Monstro";
  }

  return spell.job_name?.trim() || "Classe não informada";
}

export function isMonsterSpell(spell: Spell): boolean {
  return spell.nature === "monster";
}