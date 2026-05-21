export function normalizePcText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function renderPcValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "???";
  }

  return String(value);
}

export function isTruthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

export function formatPowerType(type: string): string {
  const labels: Record<string, string> = {
    common: "Comum",
    heroic: "Heróico",
  };

  return labels[type] ?? formatFallbackLabel(type);
}

export function formatBondAxis(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const labels: Record<string, string> = {
    admiration: "Admiração",
    inferiority: "Inferioridade",
    loyalty: "Lealdade",
    mistrust: "Desconfiança",
    affection: "Afeição",
    hatred: "Ódio",
  };

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatTargetType(value: string): string {
  const labels: Record<string, string> = {
    pc: "Personagem",
    npc: "NPC",
    monster: "Monstro",
    freeform: "Livre",
  };

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatItemType(value: string): string {
  const labels: Record<string, string> = {
    arma: "Arma",
    armadura: "Armadura",
    escudo: "Escudo",
    acessorio: "Acessório",
    consumivel: "Consumível",
  };

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatSlot(value: string): string {
  const labels: Record<string, string> = {
    main_hand: "Mão principal",
    off_hand: "Mão secundária",
    armor: "Armadura",
    accessory: "Acessório",
  };

  return labels[value] ?? formatFallbackLabel(value);
}

export function formatDamageType(value: string | null): string {
  if (!value) {
    return "???";
  }

  const labels: Record<string, string> = {
    fisico: "Físico",
    fire: "Fogo",
    ice: "Gelo",
    bolt: "Raio",
    air: "Ar",
    earth: "Terra",
    light: "Luz",
    dark: "Trevas",
    poison: "Veneno",
    veneno: "Veneno",
  };

  return labels[value] ?? formatFallbackLabel(value);
}

function formatFallbackLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}