import type { ReactNode } from "react";

import "./catalog-content-stack.css";

type CatalogContentStackProps = {
  children: ReactNode;
  className?: string;
};

export function CatalogContentStack({
  children,
  className,
}: CatalogContentStackProps) {
  return (
    <div className={getCatalogContentStackClassName(className)}>
      {children}
    </div>
  );
}

function getCatalogContentStackClassName(
  className: string | undefined,
): string {
  return ["catalog-content-stack", className].filter(Boolean).join(" ");
}