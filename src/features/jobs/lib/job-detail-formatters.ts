import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { JobArcana, JobSpell } from "../types/job";

export type JobArcanaDetail = {
  label: string;
  value: string;
};

export function hasItems<T>(items: T[] | null | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

export function getArcanaDetails(arcana: JobArcana): JobArcanaDetail[] {
  return [
    {
      label: JOBS_CATALOG_CONFIG.copy.detail.arcanas.mergeEffectLabel,
      value: readStringValue(arcana.mergeEffect),
    },
    {
      label: JOBS_CATALOG_CONFIG.copy.detail.arcanas.dismissEffectLabel,
      value: readStringValue(arcana.dismissEffect),
    },
    {
      label: JOBS_CATALOG_CONFIG.copy.detail.arcanas.specialRuleLabel,
      value: readStringValue(arcana.specialRule),
    },
  ].filter((detail) => hasText(detail.value));
}

export function getArcanaDomains(domain: string | null | undefined): string[] {
  if (!hasText(domain)) {
    return [];
  }

  return domain
    .split(",")
    .map((item) => capitalizeFirstLetter(item.trim()))
    .filter((item) => item.length > 0);
}

export function getSpellType(spell: JobSpell): string | undefined {
  return readStringValueOrUndefined(spell.type);
}

export function getSpellCost(spell: JobSpell): string | number | undefined {
  return readTextOrNumber(spell.cost) ?? readTextOrNumber(spell.mpCost);
}

export function getSpellTarget(spell: JobSpell): string | number | undefined {
  return readTextOrNumber(spell.target);
}

export function getSpellDuration(
  spell: JobSpell,
): string | number | undefined {
  return readTextOrNumber(spell.duration);
}

export function isSpellOffensive(spell: JobSpell): boolean | null {
  const value = spell.isOffensive;

  if (value === true || value === 1 || value === "1") {
    return true;
  }

  if (value === false || value === 0 || value === "0") {
    return false;
  }

  return null;
}

function readTextOrNumber(
  value: string | number | null | undefined,
): string | number | undefined {
  if (value === null || value === undefined || String(value).trim() === "") {
    return undefined;
  }

  return value;
}

function readStringValueOrUndefined(
  value: string | null | undefined,
): string | undefined {
  return hasText(value) ? value : undefined;
}

function readStringValue(value: string | null | undefined): string {
  return hasText(value) ? value : "";
}

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim().length > 0;
}

function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}