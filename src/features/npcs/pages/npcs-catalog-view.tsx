import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicNpcById } from "../api/get-public-npc-by-id";
import { getPublicNpcSummary } from "../api/get-public-npc-summary";
import { NpcCardsPanel } from "../components/npc-cards-panel";
import { NpcDetailPanel } from "../components/npc-detail-panel";
import { NpcSidebar } from "../components/npc-sidebar";
import { normalizeNpcText } from "../lib/npc-formatters";
import type { NpcDetail, NpcSummary } from "../types/npc";

type NpcsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function NpcsCatalogView({
  category,
  onCategoryChange,
}: NpcsCatalogViewProps) {
  const [npcs, setNpcs] = useState<NpcSummary[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNpcId, setSelectedNpcId] = useState<number | null>(null);
  const [selectedNpc, setSelectedNpc] = useState<NpcDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNpcs() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPublicNpcSummary();
        setNpcs(data);
      } catch {
        setError("Não foi possível carregar os NPCs.");
      } finally {
        setLoading(false);
      }
    }

    void loadNpcs();
  }, []);

  const filteredNpcs = useMemo(() => {
    const query = normalizeNpcText(search);

    return npcs.filter((npc) => {
      if (!query) {
        return true;
      }

      const searchableText = [npc.name, npc.tagline ?? ""].join(" ");

      return normalizeNpcText(searchableText).includes(query);
    });
  }, [npcs, search]);

  async function handleSelectNpc(npcId: number) {
    try {
      setSelectedNpcId(npcId);
      setDetailLoading(true);
      setDetailError(null);
      setSearch("");

      const npc = await getPublicNpcById(npcId);
      setSelectedNpc(npc);
    } catch {
      setDetailError("Não foi possível carregar os detalhes do NPC.");
      setSelectedNpc(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function handleBackToList() {
    setSelectedNpcId(null);
    setSelectedNpc(null);
    setDetailError(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    handleBackToList();
  }

  return (
    <CatalogLayout
      sidebarHeaderTitle="NPCs"
      sidebarHeaderSubtitle="Aliados, contatos e figuras importantes"
      searchPlaceholder="Buscar NPC..."
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
          <NpcSidebar
            npcs={filteredNpcs}
            selectedNpcId={selectedNpcId}
            onSelectNpc={handleSelectNpc}
          />
        )
      }
      mainContent={
        loading ? (
          <div>Carregando NPCs...</div>
        ) : error ? (
          <div>{error}</div>
        ) : detailLoading ? (
          <div>Carregando NPC...</div>
        ) : detailError ? (
          <div>{detailError}</div>
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