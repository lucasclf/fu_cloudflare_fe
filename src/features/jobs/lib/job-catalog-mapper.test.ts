import { describe, expect, it } from "vitest";

import type { JobCatalogItemDto } from "../types/job-dto";
import {
  mapJobCatalogItemDtoToJobCatalogItem,
  mapJobCatalogItemDtosToJobCatalogItems,
} from "./job-catalog-mapper";

describe("job-catalog-mapper", () => {
  const dto: JobCatalogItemDto = {
    id: 1,
    name: "Arcanista",
    tagline: "Mestre das arcanas",
    img_key: "jobs/icons/arcanista",
    allows_martial_armor: "0",
    allows_martial_shield: "0",
    allows_martial_ranged_weapon: "0",
    allows_martial_melee_weapon: "0",
    allows_arcane: "1",
    allows_rituals: true,
    can_start_projects: false,
    hp_bonus: 0,
    mp_bonus: 5,
    ip_bonus: null,
  };

  it("mapeia JobCatalogItemDto para JobCatalogItem", () => {
    expect(mapJobCatalogItemDtoToJobCatalogItem(dto)).toEqual({
      id: 1,
      name: "Arcanista",
      tagline: "Mestre das arcanas",
      imageKey: "jobs/icons/arcanista",
      allowsMartialArmor: "0",
      allowsMartialShield: "0",
      allowsMartialRangedWeapon: "0",
      allowsMartialMeleeWeapon: "0",
      allowsArcane: "1",
      allowsRituals: true,
      canStartProjects: false,
      hpBonus: 0,
      mpBonus: 5,
      ipBonus: null,
    });
  });

  it("mapeia lista de JobCatalogItemDto", () => {
    expect(mapJobCatalogItemDtosToJobCatalogItems([dto])).toEqual([
      mapJobCatalogItemDtoToJobCatalogItem(dto),
    ]);
  });
});