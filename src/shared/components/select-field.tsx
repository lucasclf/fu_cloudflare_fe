import type { SelectHTMLAttributes } from "react";

import "./select-field.css";

type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
};

type SelectFieldProps<TValue extends string> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onChange" | "value"
> & {
  id: string;
  label: string;
  value: TValue;
  options: readonly SelectOption<TValue>[];
  onChange: (value: TValue) => void;
};

export function SelectField<TValue extends string>({
  id,
  label,
  value,
  options,
  onChange,
  className,
  ...props
}: SelectFieldProps<TValue>) {
  const classes = ["select-field", className].filter(Boolean).join(" ");

  return (
    <label className={classes} htmlFor={id}>
      <span className="select-field__label">{label}</span>

      <select
        {...props}
        id={id}
        value={value}
        className="select-field__control"
        onChange={(event) => onChange(event.target.value as TValue)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
