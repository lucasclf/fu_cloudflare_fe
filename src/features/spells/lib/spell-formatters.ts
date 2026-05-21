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

export function isMonsterSpell(spell: Spell): boolean {
  return String(spell.nature).trim().toLowerCase() === "monster";
}

export function isJobSpell(spell: Spell): boolean {
  return String(spell.nature).trim().toLowerCase() === "job";
}

export function getSpellSourceName(spell: Spell): string {
  if (isMonsterSpell(spell)) {
    return "Monstros";
  }

  return spell.job_name?.trim() || "Classe não informada";
}