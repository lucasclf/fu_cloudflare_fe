import { describe, expect, it } from "vitest";

import type { JobDto } from "../types/job-dto";
import { mapJobDtoToJob } from "./job-detail-mapper";

describe("job-detail-mapper", () => {
  const dto: JobDto = {
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
    aliases: [
      {
        id: 10,
        alias: "Mago",
      },
    ],
    questions: [
      {
        id: 20,
        question: "Qual poder você teme?",
      },
    ],
    powers: [
      {
        id: 30,
        name: "Magia Aprimorada",
        type: "passivo",
        max_level: 5,
        is_global: true,
        description: "Aumenta sua aptidão mágica.",
      },
    ],
    spells: [
      {
        id: 40,
        name: "Chama",
        description: "Causa dano de fogo.",
        type: "ofensiva",
        cost: null,
        mp_cost: 10,
        target: "Uma criatura",
        duration: "Instantânea",
        is_offensive: "1",
      },
    ],
    arcanas: [
      {
        id: 50,
        name: "Arcana do Fogo",
        domain: "fogo, luz",
        merge_effect: "Efeito de fusão.",
        dismiss_effect: "Efeito de dispensa.",
        special_rule: "Regra especial.",
      },
    ],
  };

  it("mapeia JobDto para Job em camelCase", () => {
    expect(mapJobDtoToJob(dto)).toEqual({
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
      aliases: [
        {
          id: 10,
          alias: "Mago",
          name: undefined,
        },
      ],
      questions: [
        {
          id: 20,
          question: "Qual poder você teme?",
          text: undefined,
          description: undefined,
        },
      ],
      powers: [
        {
          id: 30,
          name: "Magia Aprimorada",
          type: "passivo",
          maxLevel: 5,
          isGlobal: true,
          description: "Aumenta sua aptidão mágica.",
        },
      ],
      spells: [
        {
          id: 40,
          name: "Chama",
          description: "Causa dano de fogo.",
          type: "ofensiva",
          cost: null,
          mpCost: 10,
          target: "Uma criatura",
          duration: "Instantânea",
          isOffensive: "1",
        },
      ],
      arcanas: [
        {
          id: 50,
          name: "Arcana do Fogo",
          domain: "fogo, luz",
          mergeEffect: "Efeito de fusão.",
          dismissEffect: "Efeito de dispensa.",
          specialRule: "Regra especial.",
        },
      ],
    });
  });
});
