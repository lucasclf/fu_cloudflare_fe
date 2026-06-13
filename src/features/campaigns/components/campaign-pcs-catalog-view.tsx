import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { PCS_CATALOG_CONFIG } from "@/features/pcs/config/pcs-catalog-config";
import { usePublicPcSummary } from "@/features/pcs/hooks/use-public-pc-summary";
import { usePublicPcDetail } from "@/features/pcs/hooks/use-public-pc-detail";
import { PcCardsPanel } from "@/features/pcs/components/pc-cards-panel";
import { PcDetailPanel } from "@/features/pcs/components/pc-detail-panel";
import { PcListSidebar } from "@/features/pcs/components/pc-list-sidebar";
import { normalizePcText } from "@/features/pcs/lib/pc-formatters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignPcs } from "../hooks/use-campaign-pcs";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

type CampaignPcsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignPcsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignPcsCatalogViewProps) {
  const global = usePublicPcSummary(true);
  const campaign = useCampaignPcs(campaignId);
  const { data: pcs, loading, error } = useCombinedCatalog(global, campaign);
  const [search, setSearch] = useState("");
  const [selectedPcId, setSelectedPcId] = useState<number | null>(null);
  const {
    data: selectedPc,
    loading: detailLoading,
    error: detailError,
  } = usePublicPcDetail(selectedPcId);

  const filteredPcs = useMemo(() => {
    const query = normalizePcText(search);

    return (pcs ?? []).filter((pc) => {
      if (!query) return true;

      return normalizePcText(`${pc.name} ${pc.tagline ?? ""}`).includes(query);
    });
  }, [pcs, search]);

  function handleSelectPc(pcId: number) {
    setSelectedPcId(pcId);
    setSearch("");
  }

  function handleBackToList() {
    setSelectedPcId(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedPcId(null);
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle={PCS_CATALOG_CONFIG.layout.sidebarHeaderTitle}
      sidebarHeaderSubtitle={PCS_CATALOG_CONFIG.layout.sidebarHeaderSubtitle}
      searchPlaceholder={PCS_CATALOG_CONFIG.layout.searchPlaceholder}
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
          <PcListSidebar
            pcs={filteredPcs}
            selectedPcId={selectedPcId}
            onSelectPc={handleSelectPc}
            onClearSelection={handleBackToList}
          />
        )
      }
      mainContent={
        loading ? (
          <LoadingState message={PCS_CATALOG_CONFIG.copy.main.loadingMessage} />
        ) : error ? (
          <ErrorState message={error} />
        ) : detailLoading ? (
          <LoadingState
            message={PCS_CATALOG_CONFIG.copy.detail.loadingMessage}
          />
        ) : detailError ? (
          <ErrorState message={detailError} />
        ) : selectedPc ? (
          <PcDetailPanel pc={selectedPc} onBackToList={handleBackToList} />
        ) : (
          <PcCardsPanel
            pcs={filteredPcs}
            selectedPcId={selectedPcId}
            onSelectPc={handleSelectPc}
          />
        )
      }
    />
  );
}
