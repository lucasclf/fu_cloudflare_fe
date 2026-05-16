import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicPcById } from "../api/get-public-pc-by-id";
import { getPublicPcSummary } from "../api/get-public-pc-summary";
import { PcCardsPanel } from "../components/pc-cards-panel";
import { PcDetailPanel } from "../components/pc-detail-panel";
import { PcSidebar } from "../components/pc-sidebar";
import { normalizePcText } from "../lib/pc-formatters";
import type { PcDetail, PcSummary } from "../types/pc";

type PcsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function PcsCatalogView({
  category,
  onCategoryChange,
}: PcsCatalogViewProps) {
  const [pcs, setPcs] = useState<PcSummary[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPcId, setSelectedPcId] = useState<number | null>(null);
  const [selectedPc, setSelectedPc] = useState<PcDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPcs() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicPcSummary();
        setPcs(data);
      } catch {
        setError("Não foi possível carregar os personagens.");
      } finally {
        setLoading(false);
      }
    }

    void loadPcs();
  }, []);

  const filteredPcs = useMemo(() => {
    const query = normalizePcText(search);

    return pcs.filter((pc) => {
      if (!query) {
        return true;
      }

      return normalizePcText(`${pc.name} ${pc.tagline ?? ""}`).includes(query);
    });
  }, [pcs, search]);

  async function handleSelectPc(pcId: number) {
    try {
      setSelectedPcId(pcId);
      setDetailLoading(true);
      setDetailError(null);
      setSearch("");

      const pc = await getPublicPcById(pcId);
      setSelectedPc(pc);
    } catch {
      setDetailError("Não foi possível carregar os detalhes do personagem.");
      setSelectedPc(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function handleBackToList() {
    setSelectedPcId(null);
    setSelectedPc(null);
    setDetailError(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    handleBackToList();
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="Personagens"
      sidebarHeaderSubtitle="Personagens dos jogadores"
      searchPlaceholder="Buscar personagem..."
      searchValue={search}
      onSearchChange={handleSearchChange}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        loading ? (
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : error ? (
          <div style={{ padding: "16px" }}>{error}</div>
        ) : (
          <PcSidebar
            pcs={filteredPcs}
            selectedPcId={selectedPcId}
            onSelectPc={handleSelectPc}
          />
        )
      }
      mainContent={
        loading ? (
          <div>Carregando personagens...</div>
        ) : error ? (
          <div>{error}</div>
        ) : detailLoading ? (
          <div>Carregando personagem...</div>
        ) : detailError ? (
          <div>{detailError}</div>
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