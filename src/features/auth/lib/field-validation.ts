const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BuiltInValidationAttrs = {
  required?: boolean;
  type?: string;
  minLength?: number;
};

/**
 * Deriva uma mensagem de erro amigável a partir dos próprios atributos HTML
 * do campo (required/type/minLength) — os mesmos que já orientam a validação
 * nativa do navegador — para manter um único lugar de verdade sobre o que
 * cada campo exige.
 */
export function getBuiltInFieldError(
  value: string,
  { required, type, minLength }: BuiltInValidationAttrs,
): string | null {
  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    return "Preencha este campo.";
  }

  if (trimmed.length === 0) {
    return null;
  }

  if (type === "email" && !EMAIL_PATTERN.test(trimmed)) {
    return "Informe um e-mail em um formato válido.";
  }

  if (typeof minLength === "number" && value.length < minLength) {
    return `Use pelo menos ${minLength} caracteres.`;
  }

  return null;
}
