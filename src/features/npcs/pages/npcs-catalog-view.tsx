import { useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingState } from "../../../shared/components/loading-state";
import { NPCS_CATALOG_CONFIG } from "../config/npcs-catalog-config";
import { usePublicNpcSummary } from "../hooks/use-public-npc-summary";
import { usePublicNpcDetail } from "../hooks/use-public-npc-detail";
import { NpcCardsPanel } from "../components/npc-cards-panel";
import { NpcDetailPanel } from "../components/npc-detail-panel";
import { NpcListSidebar } from "../components/npc-list-sidebar";
import { normalizeNpcText } from "../lib/npc-formatters";

type NpcsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function NpcsCatalogView({
  category,
  onCategoryChange,
}: NpcsCatalogViewProps) {
  const { data: npcs, loading, error } = usePublicNpcSummary();
  const [search, setSearch] = useState("");
  const [selectedNpcId, setSelectedNpcId] = useState<number | null>(null);
  const {
    data: selectedNpc,
    loading: detailLoading,
    error: detailError,
  } = usePublicNpcDetail(selectedNpcId);

  const filteredNpcs = useMemo(() => {
    const query = normalizeNpcText(search);

    return (npcs ?? []).filter((npc) => {
      if (!query) return true;

      const searchableText = [npc.name, npc.tagline ?? ""].join(" ");
      return normalizeNpcText(searchableText).includes(query);
    });
  }, [npcs, search]);

  function handleSelectNpc(npcId: number) {
    setSelectedNpcId(npcId);
    setSearch("");
  }

  function handleBackToList() {
    setSelectedNpcId(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedNpcId(null);
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle={NPCS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={NPCS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={NPCS_CATALOG_CONFIG.layout.searchPlaceholder}
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <NpcListSidebar
            npcs={filteredNpcs}
            selectedNpcId={selectedNpcId}
            onSelectNpc={handleSelectNpc}
            onClearSelection={handleBackToList}
          />
        )
      }
      mainContent={
        loading ? (
          <LoadingState
            message={NPCS_CATALOG_CONFIG.copy.main.loadingMessage}
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : detailLoading ? (
          <LoadingState
            message={NPCS_CATALOG_CONFIG.copy.detail.loadingMessage}
          />
        ) : detailError ? (
          <ErrorState message={detailError} />
        ) : selectedNpc ? (
          <NpcDetailPanel npc={selectedNpc} onBackToList={handleBackToList} />
        ) : (
          <NpcCardsPanel
            npcs={filteredNpcs}
            selectedNpcId={selectedNpcId}
            onSelectNpc={handleSelectNpc}
          />
        )
      }
    />
  );
}
