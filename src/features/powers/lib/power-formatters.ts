import type { Power, PowerType } from "../types/power";

export function normalizePowerText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getPowerJobNames(power: Power): string[] {
  return Array.isArray(power.job_name) ? power.job_name : [];
}

export function isPowerUnrestricted(power: Power): boolean {
  return getPowerJobNames(power).length === 0;
}

export function formatPowerType(type: PowerType): string {
  if (type === "heroic") {
    return "Poder Heróico";
  }

  return "Poder Comum";
}

export function formatMaxLevel(maxLevel: number): string {
  if (maxLevel <= 1) {
    return "Nível único";
  }

  return `Até nível ${maxLevel}`;
}