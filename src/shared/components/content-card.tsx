import type { ElementType, ReactNode } from "react";

import "./content-card.css";

type ContentCardVariant = "elevated" | "surface";
type ContentCardPadding = "md" | "lg";

type ContentCardProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: ContentCardVariant;
  padding?: ContentCardPadding;
  className?: string;
};

export function ContentCard({
  children,
  as: Component = "div",
  variant = "elevated",
  padding = "md",
  className,
}: ContentCardProps) {
  return (
    <Component className={getContentCardClassName(variant, padding, className)}>
      {children}
    </Component>
  );
}

function getContentCardClassName(
  variant: ContentCardVariant,
  padding: ContentCardPadding,
  className: string | undefined,
): string {
  return [
    "content-card",
    `content-card--${variant}`,
    `content-card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
