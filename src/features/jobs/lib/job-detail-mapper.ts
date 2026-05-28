import { mapJobCatalogItemDtoToJobCatalogItem } from "./job-catalog-mapper";
import type {
  JobAlias,
  JobArcana,
  JobPower,
  JobQuestion,
  JobSpell,
  Job,
} from "../types/job";
import type {
  JobAliasDto,
  JobArcanaDto,
  JobDto,
  JobPowerDto,
  JobQuestionDto,
  JobSpellDto,
} from "../types/job-dto";

export function mapJobDtoToJob(dto: JobDto): Job {
  return {
    ...mapJobCatalogItemDtoToJobCatalogItem(dto),
    aliases: dto.aliases?.map(mapJobAliasDtoToJobAlias),
    questions: dto.questions?.map(mapJobQuestionDtoToJobQuestion),
    powers: dto.powers?.map(mapJobPowerDtoToJobPower),
    spells: dto.spells?.map(mapJobSpellDtoToJobSpell),
    arcanas: dto.arcanas?.map(mapJobArcanaDtoToJobArcana),
  };
}

function mapJobAliasDtoToJobAlias(dto: JobAliasDto): JobAlias {
  return {
    id: dto.id,
    alias: dto.alias,
    name: dto.name,
  };
}

function mapJobQuestionDtoToJobQuestion(dto: JobQuestionDto): JobQuestion {
  return {
    id: dto.id,
    question: dto.question,
    text: dto.text,
  };
}

function mapJobPowerDtoToJobPower(dto: JobPowerDto): JobPower {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    maxLevel: dto.max_level,
    isGlobal: dto.is_global,
    description: dto.description,
  };
}

function mapJobSpellDtoToJobSpell(dto: JobSpellDto): JobSpell {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    type: dto.type,
    cost: dto.cost,
    mpCost: dto.mp_cost,
    target: dto.target,
    duration: dto.duration,
    isOffensive: dto.is_offensive,
  };
}

function mapJobArcanaDtoToJobArcana(dto: JobArcanaDto): JobArcana {
  return {
    id: dto.id,
    name: dto.name,
    domain: dto.domain,
    mergeEffect: dto.merge_effect,
    dismissEffect: dto.dismiss_effect,
    specialRule: dto.special_rule,
  };
}