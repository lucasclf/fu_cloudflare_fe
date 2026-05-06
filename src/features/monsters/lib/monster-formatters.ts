import type {
  MonsterAction,
  MonsterAffinityValue,
  MonsterSummary,
} from "../types/monster";

export function normalizeMonsterText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function formatMonsterType(type: string): string {
  const labels: Record<string, string> = {
    beast: "Besta",
    construct: "Construto",
    demon: "Demônio",
    elemental: "Elemental",
    humanoid: "Humanoide",
    monster: "Monstro",
    plant: "Planta",
    undead: "Morto-vivo",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatAffinityValue(value: MonsterAffinityValue): string {
  const labels: Record<string, string> = {
    normal: "Normal",
    vulnerable: "Vulnerável",
    resistant: "Resistente",
    immune: "Imune",
    absorbs: "Absorve",
  };

  if (!value) {
    return "—";
  }

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatAffinityType(type: string): string {
  const labels: Record<string, string> = {
    physical: "Físico",
    air: "Ar",
    bolt: "Raio",
    dark: "Trevas",
    earth: "Terra",
    fire: "Fogo",
    ice: "Gelo",
    light: "Luz",
    poison: "Veneno",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatActionType(type: string): string {
  const labels: Record<string, string> = {
    basic_attack: "Ataque básico",
    spell: "Magia",
    other_action: "Ação",
    special_rule: "Regra especial",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatActionIcon(icon: string | null): string {
  if (!icon) {
    return "Ação";
  }

  const labels: Record<string, string> = {
    melee: "Corpo a corpo",
    ranged: "À distância",
    magic: "Mágica",
    support: "Suporte",
    passive: "Passiva",
  };

  return labels[icon] ?? formatFallbackLabel(icon);
}

export function isMonsterActionOffensive(action: MonsterAction): boolean {
  return (
    action.is_offensive === true ||
    action.is_offensive === 1 ||
    action.is_offensive === "1"
  );
}

export function getMonsterTypeCounts(monsters: MonsterSummary[]) {
  const counts = new Map<string, number>();

  for (const monster of monsters) {
    counts.set(
      monster.monster_type,
      (counts.get(monster.monster_type) ?? 0) + 1,
    );
  }

  return Array.from(counts.entries())
    .map(([type, count]) => ({
      type,
      label: formatMonsterType(type),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function renderMonsterValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "—";
  }

  return String(value);
}

function formatFallbackLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}