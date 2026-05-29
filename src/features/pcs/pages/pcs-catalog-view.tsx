import { useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingState } from "../../../shared/components/loading-state";
import { PCS_CATALOG_CONFIG } from "../config/pcs-catalog-config";
import { usePublicPcSummary } from "../hooks/use-public-pc-summary";
import { usePublicPcDetail } from "../hooks/use-public-pc-detail";
import { PcCardsPanel } from "../components/pc-cards-panel";
import { PcDetailPanel } from "../components/pc-detail-panel";
import { PcListSidebar } from "../components/pc-list-sidebar";
import { normalizePcText } from "../lib/pc-formatters";

type PcsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function PcsCatalogView({
  category,
  onCategoryChange,
}: PcsCatalogViewProps) {
  const { data: pcs, loading, error } = usePublicPcSummary();
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
        <CategorySwitcher value={category} onChange={onCategoryChange} />
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
          <LoadingState message={PCS_CATALOG_CONFIG.copy.detail.loadingMessage} />
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
