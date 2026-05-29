import type { ReactNode } from "react";

import "./catalog-empty-message.css";

type CatalogEmptyMessageProps = {
  children: ReactNode;
  className?: string;
};

export function CatalogEmptyMessage({
  children,
  className,
}: CatalogEmptyMessageProps) {
  return (
    <p className={getCatalogEmptyMessageClassName(className)}>
      {children}
    </p>
  );
}

function getCatalogEmptyMessageClassName(
  className: string | undefined,
): string {
  return ["catalog-empty-message", className].filter(Boolean).join(" ");
}