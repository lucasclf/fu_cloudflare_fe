import type { JobAlias, JobQuestion } from "../types/job";

export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function renderOptionalValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || String(value).trim().length === 0) {
    return "—";
  }

  return String(value);
}

export function renderTokenLabel(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
