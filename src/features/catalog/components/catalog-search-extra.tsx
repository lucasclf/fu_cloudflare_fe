import type { ReactNode } from "react";

import { Button } from "@/shared/components/button";

import "./catalog-search-extra.css";

type CatalogSearchExtraProps = {
  hasActiveFilters: boolean;
  clearButtonLabel: string;
  onClearFilters: () => void;
  children?: ReactNode;
};

export function CatalogSearchExtra({
  hasActiveFilters,
  clearButtonLabel,
  onClearFilters,
  children,
}: CatalogSearchExtraProps) {
  if (!children && !hasActiveFilters) {
    return null;
  }

  return (
    <div className="catalog-search-extra">
      {children}

      {hasActiveFilters ? (
        <Button variant="ghost" fullWidth onClick={onClearFilters}>
          {clearButtonLabel}
        </Button>
      ) : null}
    </div>
  );
}
