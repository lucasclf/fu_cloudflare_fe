import type { ComponentType } from "react";

import type { AllowanceKey, BonusKey } from "../lib/job-feature-filters";
import {
  ArcaneIcon,
  ArmorIcon,
  BowIcon,
  HealthIcon,
  InventoryIcon,
  ManaIcon,
  ProjectIcon,
  RitualIcon,
  ShieldIcon,
  SwordIcon,
} from "./job-feature-icons";

type JobFeatureIcon = ComponentType;

export type AllowanceDefinition = {
  key: AllowanceKey;
  label: string;
  Icon: JobFeatureIcon;
};

export type BonusDefinition = {
  key: BonusKey;
  label: string;
  shortLabel: string;
  Icon: JobFeatureIcon;
};

export const ALLOWANCE_DEFINITIONS: AllowanceDefinition[] = [
  {
    key: "allowsMartialArmor",
    label: "Armaduras marciais",
    Icon: ArmorIcon,
  },
  {
    key: "allowsMartialShield",
    label: "Escudos marciais",
    Icon: ShieldIcon,
  },
  {
    key: "allowsMartialRangedWeapon",
    label: "Armas à distância marciais",
    Icon: BowIcon,
  },
  {
    key: "allowsMartialMeleeWeapon",
    label: "Armas corpo a corpo marciais",
    Icon: SwordIcon,
  },
  {
    key: "allowsArcane",
    label: "Arcanas",
    Icon: ArcaneIcon,
  },
  {
    key: "allowsRituals",
    label: "Rituais",
    Icon: RitualIcon,
  },
  {
    key: "canStartProjects",
    label: "Criação de projetos",
    Icon: ProjectIcon,
  },
];

export const BONUS_DEFINITIONS: BonusDefinition[] = [
  {
    key: "hpBonus",
    label: "Bônus de PV",
    shortLabel: "PV",
    Icon: HealthIcon,
  },
  {
    key: "mpBonus",
    label: "Bônus de PM",
    shortLabel: "PM",
    Icon: ManaIcon,
  },
  {
    key: "ipBonus",
    label: "Bônus de PI",
    shortLabel: "PI",
    Icon: InventoryIcon,
  },
];