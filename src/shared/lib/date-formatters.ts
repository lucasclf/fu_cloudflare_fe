import { renderOptionalValue } from "./text-formatters";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatDateLabel(value: string | null | undefined): string {
  if (!value || value.trim().length === 0) {
    return renderOptionalValue(value);
  }

  const normalizedValue = value.trim();
  const dateOnlyMatch = normalizedValue.match(DATE_ONLY_PATTERN);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return normalizedValue;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(date);
}
