import type { CSSProperties, ReactNode } from "react";
import type { JobBonusValue, JobCatalogItem, JobFlagValue } from "../types/job";

export type AllowanceKey = keyof Pick<
  JobCatalogItem,
  | "allows_martial_armor"
  | "allows_martial_shield"
  | "allows_martial_ranged_weapon"
  | "allows_martial_melee_weapon"
  | "allows_arcane"
  | "allows_rituals"
  | "can_start_projects"
>;

export type BonusKey = keyof Pick<
  JobCatalogItem,
  "hp_bonus" | "mp_bonus" | "ip_bonus"
>;

export type JobFeatureFilterKey = AllowanceKey | BonusKey;

type AllowanceDefinition = {
  key: AllowanceKey;
  label: string;
  icon: ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  focusable: false,
  "aria-hidden": true,
  style: {
    width: "15px",
    height: "15px",
    display: "block",
  } satisfies CSSProperties,
};

function ArmorIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 3h8l2 4-2 3v10H8V10L6 7l2-4Z" />
      <path d="M9 4.5c.7 1.4 1.7 2.1 3 2.1s2.3-.7 3-2.1" />
      <path d="M9.5 11.5h5" />
      <path d="M9.5 15.5h5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 19 6v5.5c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6l7-3Z" />
      <path d="M12 7v9" />
    </svg>
  );
}

function BowIcon() {
  return (
    <svg {...iconProps}>
      <path d="M7 4c4 3.5 4 12.5 0 16" />
      <path d="M7 4c8 2.5 8 13.5 0 16" />
      <path d="M4 12h15" />
      <path d="m16 9 3 3-3 3" />
    </svg>
  );
}

function SwordIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 4.5 20 4l-.5 5.5L9.5 19.5l-5-5L14.5 4.5Z" />
      <path d="m6.5 17.5-3 3" />
      <path d="m8 13 3 3" />
    </svg>
  );
}

function ArcaneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
      <path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15Z" />
    </svg>
  );
}

function RitualIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 21h8" />
      <path d="M10 21v-6h4v6" />
      <path d="M12 15c2.2 0 4-1.8 4-4 0-3-4-8-4-8s-4 5-4 8c0 2.2 1.8 4 4 4Z" />
      <path d="M12 12c.9 0 1.6-.7 1.6-1.6 0-1.2-1.6-3.1-1.6-3.1s-1.6 1.9-1.6 3.1c0 .9.7 1.6 1.6 1.6Z" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 5.5 18 2l4 4-3.5 3.5" />
      <path d="M3 21l7.5-7.5" />
      <path d="m12.5 7.5 4 4" />
      <path d="M4 13h6" />
      <path d="M7 10v6" />
      <path d="M16 16h5" />
      <path d="M18.5 13.5v5" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 20.5s-7-4.4-9.2-8.7C1.2 8.7 2.3 5.2 5.4 4.1 7.4 3.4 9.6 4.1 12 6.5c2.4-2.4 4.6-3.1 6.6-2.4 3.1 1.1 4.2 4.6 2.6 7.7C19 16.1 12 20.5 12 20.5Z" />
    </svg>
  );
}

function ManaIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 7V5.8C8 3.7 9.7 2 11.8 2h.4C14.3 2 16 3.7 16 5.8V7" />
      <path d="M5.5 7h13l1.2 12.2c.1 1-.7 1.8-1.7 1.8H6c-1 0-1.8-.8-1.7-1.8L5.5 7Z" />
      <path d="M9 12h6" />
    </svg>
  );
}

export const ALLOWANCE_DEFINITIONS: AllowanceDefinition[] = [
  {
    key: "allows_martial_armor",
    label: "Armaduras marciais",
    icon: <ArmorIcon />,
  },
  {
    key: "allows_martial_shield",
    label: "Escudos marciais",
    icon: <ShieldIcon />,
  },
  {
    key: "allows_martial_ranged_weapon",
    label: "Armas à distância marciais",
    icon: <BowIcon />,
  },
  {
    key: "allows_martial_melee_weapon",
    label: "Armas corpo a corpo marciais",
    icon: <SwordIcon />,
  },
  {
    key: "allows_arcane",
    label: "Arcanas",
    icon: <ArcaneIcon />,
  },
  {
    key: "allows_rituals",
    label: "Rituais",
    icon: <RitualIcon />,
  },
  {
    key: "can_start_projects",
    label: "Criação de projetos",
    icon: <ProjectIcon />,
  },
];

type BonusDefinition = {
  key: BonusKey;
  label: string;
  shortLabel: string;
  icon: ReactNode;
};

export const BONUS_DEFINITIONS: BonusDefinition[] = [
  {
    key: "hp_bonus",
    label: "Bônus de PV",
    shortLabel: "PV",
    icon: <HealthIcon />,
  },
  {
    key: "mp_bonus",
    label: "Bônus de PM",
    shortLabel: "PM",
    icon: <ManaIcon />,
  },
  {
    key: "ip_bonus",
    label: "Bônus de PI",
    shortLabel: "PI",
    icon: <InventoryIcon />,
  },
];

export function isJobAllowanceEnabled(value: JobFlagValue): boolean {
  return value === true || value === 1 || value === "1";
}

const BONUS_KEYS: BonusKey[] = ["hp_bonus", "mp_bonus", "ip_bonus"];

export function getPositiveJobBonus(value: JobBonusValue): number {
  const bonus = Number(value);
  return Number.isFinite(bonus) && bonus > 0 ? bonus : 0;
}

export function isJobBonusKey(key: JobFeatureFilterKey): key is BonusKey {
  return BONUS_KEYS.includes(key as BonusKey);
}
