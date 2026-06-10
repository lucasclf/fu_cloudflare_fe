export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim().length > 0;
}

export function renderOptionalValue(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    String(value).trim().length === 0
  ) {
    return "—";
  }

  return String(value);
}

export function renderTokenLabel(value: string | null | undefined): string {
  if (!hasText(value)) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map(capitalizeFirstLetter)
    .join(" ");
}

export function getInitials(value: string, maxParts = 2): string {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, maxParts)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function toSnakeCaseKey(value: string): string {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

const DAMAGE_TYPE_LABELS: Record<string, string> = {
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

export function formatDamageType(value: string | null | undefined): string {
  if (!hasText(value)) {
    return "—";
  }

  return DAMAGE_TYPE_LABELS[value] ?? capitalizeFirstLetter(value);
}
