import { useState } from "react";
import type { FocusEvent, InputHTMLAttributes } from "react";

import { getBuiltInFieldError } from "../lib/field-validation";

import "./auth-field.css";

type AuthFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange"
> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /**
   * Mensagem de erro vinda de uma checagem que o campo não consegue derivar
   * sozinho (ex.: comparação com outro campo). Usada quando `invalid` é true
   * e nenhum erro embutido (obrigatoriedade/formato/tamanho) se aplica.
   */
  invalid?: boolean;
  errorMessage?: string;
  /** Exibe destaque de sucesso (contorno verde + selo de confirmação). */
  valid?: boolean;
};

export function AuthField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  className,
  required,
  minLength,
  invalid = false,
  errorMessage,
  valid = false,
  ...props
}: AuthFieldProps) {
  const [touched, setTouched] = useState(false);

  const builtInError = getBuiltInFieldError(value, {
    required,
    type,
    minLength: typeof minLength === "number" ? minLength : undefined,
  });
  const error = builtInError ?? (invalid ? (errorMessage ?? null) : null);

  const showInvalid = touched && error !== null;
  const showValid = touched && valid && !showInvalid;

  const classes = [
    "auth-field",
    showInvalid && "auth-field--invalid",
    showValid && "auth-field--valid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const messageId = `${id}-message`;

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setTouched(true);
    onBlur?.(event);
  }

  return (
    <label className={classes} htmlFor={id}>
      <span className="auth-field__label">{label}</span>

      <span className="auth-field__control-wrapper">
        <input
          {...props}
          id={id}
          type={type}
          value={value}
          required={required}
          minLength={minLength}
          aria-invalid={showInvalid || undefined}
          aria-describedby={showInvalid ? messageId : undefined}
          className="auth-field__control"
          onChange={(event) => onChange(event.target.value)}
          onBlur={handleBlur}
        />

        {showValid ? (
          <span className="auth-field__valid-mark" aria-hidden="true">
            ✓
          </span>
        ) : null}
      </span>

      {showInvalid && error ? (
        <span id={messageId} className="auth-field__message">
          {error}
        </span>
      ) : null}
    </label>
  );
}
