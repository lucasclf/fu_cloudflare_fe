import type { InputHTMLAttributes } from "react";

import "./search-field.css";

type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
};

export function SearchField({
  id,
  label,
  value,
  onChange,
  hideLabel = false,
  className,
  ...props
}: SearchFieldProps) {
  const classes = ["search-field", className].filter(Boolean).join(" ");

  const labelClasses = [
    "search-field__label",
    hideLabel ? "search-field__label--hidden" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes} htmlFor={id}>
      <span className={labelClasses}>{label}</span>

      <input
        {...props}
        id={id}
        type="search"
        value={value}
        className="search-field__control"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}