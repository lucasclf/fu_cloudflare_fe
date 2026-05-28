import { CategorySwitcher } from "@/features/catalog/components/category-switcher";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { CatalogSearchExtra } from "@/features/catalog/components/catalog-search-extra";
import type { CatalogCategory } from "@/features/catalog/types/category";
import { SessionsCatalogMainContent } from "../components/sessions-catalog-main-content";
import { SessionsCatalogSidebarContent } from "../components/sessions-catalog-sidebar-content";
import { SESSIONS_CATALOG_CONFIG } from "../config/sessions-catalog-config";
import { usePublicSessions } from "../hooks/use-public-sessions";
import { useSessionsCatalogState } from "../hooks/use-sessions-catalog-state";

type SessionsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function SessionsCatalogView({
  category,
  onCategoryChange,
}: SessionsCatalogViewProps) {
  const { data: sessions, loading, error } = usePublicSessions();

  const {
    search,
    selectedSessionId,
    filteredSessions,
    sessionsToRender,
    hasActiveFilters,
    setSearch,
    selectSession,
    clearSelection,
  } = useSessionsCatalogState({
    sessions: sessions ?? [],
  });

  return (
    <CatalogLayout
      sidebarHeaderTitle={SESSIONS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={
        SESSIONS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle
      }
      searchPlaceholder={SESSIONS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      searchExtraContent={
        <CatalogSearchExtra
          hasActiveFilters={hasActiveFilters}
          clearButtonLabel={
            SESSIONS_CATALOG_CONFIG.copy.filters.clearButtonLabel
          }
          onClearFilters={clearSelection}
        />
      }
      sidebarContent={
        <SessionsCatalogSidebarContent
          loading={loading}
          error={error}
          sessions={filteredSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={selectSession}
          onClearSelection={clearSelection}
        />
      }
      mainContent={
        <SessionsCatalogMainContent
          loading={loading}
          error={error}
          sessions={sessionsToRender}
          hasActiveFilters={hasActiveFilters}
        />
      }
    />
  );
}
