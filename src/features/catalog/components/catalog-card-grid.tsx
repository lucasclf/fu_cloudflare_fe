import type { ReactNode } from "react";

import "./catalog-card-grid.css";

type CatalogCardGridProps = {
  children: ReactNode;
  className?: string;
};

export function CatalogCardGrid({ children, className }: CatalogCardGridProps) {
  return (
    <div className={getCatalogCardGridClassName(className)}>
      {children}
    </div>
  );
}

function getCatalogCardGridClassName(className: string | undefined): string {
  return ["catalog-card-grid", className].filter(Boolean).join(" ");
}