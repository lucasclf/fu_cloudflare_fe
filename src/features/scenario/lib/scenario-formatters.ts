import type {
  ScenarioEntity,
  ScenarioEntityType,
  ScenarioFaction,
  ScenarioLocation,
} from "../types/scenario";

const LOCATION_SUBTYPE_LABELS: Record<string, string> = {
  region: "Região",
  city: "Cidade",
  village: "Vilarejo",
  dungeon: "Masmorra",
  landmark: "Marco",
  building: "Edifício",
  other: "Outro",
};

const FACTION_SUBTYPE_LABELS: Record<string, string> = {
  guild: "Guilda",
  kingdom: "Nação",
  order: "Ordem",
  cult: "Culto",
  clan: "Clã",
  company: "Companhia",
  criminal: "Organização criminosa",
  military: "Força militar",
  other: "Outro",
};

export function normalizeScenarioText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isLocation(entity: ScenarioEntity): entity is ScenarioLocation {
  return entity.type === "location";
}

export function isFaction(entity: ScenarioEntity): entity is ScenarioFaction {
  return entity.type === "faction";
}

export function formatScenarioEntityType(type: ScenarioEntityType): string {
  if (type === "location") {
    return "Local";
  }

  return "Facção";
}

export function formatScenarioSubtype(
  type: ScenarioEntityType,
  subtype: string | null | undefined,
): string | null {
  if (!subtype || subtype.trim().length === 0) {
    return null;
  }

  const normalizedSubtype = subtype.trim().toLowerCase();

  const labels =
    type === "location" ? LOCATION_SUBTYPE_LABELS : FACTION_SUBTYPE_LABELS;

  const translated = labels[normalizedSubtype];

  if (translated) {
    return translated;
  }

  return normalizedSubtype
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRelationType(relationType: string): string {
  const labels: Record<string, string> = {
    headquarters: "Sede",
    territory: "Território",
    influence: "Influência",
    origin: "Origem",
    presence: "Presença",
    enemy_presence: "Presença Hostil",
    other: "Outro",
  };

  return labels[relationType] ?? relationType.replaceAll("_", " ");
}

export function renderScenarioValue(value: string | null | undefined): string {
  if (!value || value.trim().length === 0) {
    return "—";
  }

  return value;
}