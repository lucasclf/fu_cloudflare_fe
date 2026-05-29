import {
  normalizeSearchText,
  renderOptionalValue,
  renderTokenLabel,
} from "@/shared/lib/text-formatters";
import type { JobAlias, JobQuestion } from "../types/job";

export { normalizeSearchText as normalizeText };
export { renderOptionalValue, renderTokenLabel };

export function getQuestionText(question: JobQuestion): string {
  return (
    question.question ??
    question.text ??
    question.description ??
    "Pergunta sem texto cadastrado."
  );
}

export function getAliasText(alias: JobAlias): string {
  return alias.alias ?? alias.name ?? "Apelido sem texto cadastrado.";
}