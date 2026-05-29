import type { ReactNode } from "react";

import "./badge.css";

type BadgeVariant = "accent" | "muted" | "strong" | "surface";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
  ariaLabel?: string;
};

export function Badge({
  children,
  variant = "surface",
  className,
  title,
  ariaLabel,
}: BadgeProps) {
  return (
    <span
      className={getBadgeClassName(variant, className)}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}

function getBadgeClassName(
  variant: BadgeVariant,
  className: string | undefined,
): string {
  return ["badge", `badge--${variant}`, className].filter(Boolean).join(" ");
}
