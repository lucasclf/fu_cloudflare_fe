import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { NPCS_CATALOG_CONFIG } from "@/features/npcs/config/npcs-catalog-config";
import { usePublicNpcSummary } from "@/features/npcs/hooks/use-public-npc-summary";
import { usePublicNpcDetail } from "@/features/npcs/hooks/use-public-npc-detail";
import { NpcCardsPanel } from "@/features/npcs/components/npc-cards-panel";
import { NpcDetailPanel } from "@/features/npcs/components/npc-detail-panel";
import { NpcListSidebar } from "@/features/npcs/components/npc-list-sidebar";
import { normalizeNpcText } from "@/features/npcs/lib/npc-formatters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignNpcs } from "../hooks/use-campaign-npcs";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

type CampaignNpcsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignNpcsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignNpcsCatalogViewProps) {
  const global = usePublicNpcSummary(true);
  const campaign = useCampaignNpcs(campaignId);
  const { data: npcs, loading, error } = useCombinedCatalog(global, campaign);
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
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
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
