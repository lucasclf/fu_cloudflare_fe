import type { ComponentType, ReactNode } from "react";

import "./job-feature-chip.css";

type JobFeatureChipVariant = "icon" | "label";

type JobFeatureChipProps = {
  Icon: ComponentType;
  label: string;
  statusLabel?: string;
  active?: boolean;
  variant?: JobFeatureChipVariant;
  children?: ReactNode;
};

export function JobFeatureChip({
  Icon,
  label,
  statusLabel,
  active = true,
  variant = "icon",
  children,
}: JobFeatureChipProps) {
  const ariaLabel = statusLabel ? `${label}: ${statusLabel}` : label;

  return (
    <span
      className={getChipClassName(active, variant, Boolean(children))}
      title={ariaLabel}
      aria-label={ariaLabel}
    >
      <span className="job-feature-chip__icon">
        <Icon />
      </span>

      {children ? (
        <span className="job-feature-chip__text">{children}</span>
      ) : null}
    </span>
  );
}

function getChipClassName(
  active: boolean,
  variant: JobFeatureChipVariant,
  hasText: boolean,
): string {
  return [
    "job-feature-chip",
    active ? "job-feature-chip--active" : "job-feature-chip--inactive",
    variant === "label" ? "job-feature-chip--label" : null,
    hasText ? "job-feature-chip--with-text" : null,
  ]
    .filter(Boolean)
    .join(" ");
}
