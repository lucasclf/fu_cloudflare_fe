import type { ReactNode } from "react";

import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

type CatalogEmptyStateConfig = {
  isEmpty: boolean;
  title: string;
  description: string;
};

type CatalogStateBoundaryProps = {
  loading: boolean;
  error: string | null;
  loadingMessage: string;
  emptyState?: CatalogEmptyStateConfig;
  children: ReactNode;
};

export function CatalogStateBoundary({
  loading,
  error,
  loadingMessage,
  emptyState,
  children,
}: CatalogStateBoundaryProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (emptyState?.isEmpty) {
    return (
      <EmptyState
        title={emptyState.title}
        description={emptyState.description}
      />
    );
  }

  return <>{children}</>;
}
