import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { ListSidebar } from "@/shared/components/list-sidebar";
import { normalizeSearchText } from "@/shared/lib/text-formatters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { usePublicArcanas } from "@/features/arcanas/hooks/use-public-arcanas";
import { useCampaignArcanas } from "../hooks/use-campaign-arcanas";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

import styles from "./campaign-simple-catalog-view.module.css";

type CampaignArcanasCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignArcanasCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignArcanasCatalogViewProps) {
  const global = usePublicArcanas(true);
  const campaign = useCampaignArcanas(campaignId);
  const { data: arcanas, loading, error } = useCombinedCatalog(global, campaign);
  const arcanasList = useMemo(() => arcanas ?? [], [arcanas]);

  const [search, setSearch] = useState("");
  const [selectedArcanaId, setSelectedArcanaId] = useState<number | null>(null);

  const filteredArcanas = useMemo(() => {
    const query = normalizeSearchText(search);

    return arcanasList.filter((arcana) => {
      if (!query) return true;

      const searchableText = [arcana.name, arcana.domain].join(" ");
      return normalizeSearchText(searchableText).includes(query);
    });
  }, [arcanasList, search]);

  const visibleArcanas = useMemo(() => {
    if (selectedArcanaId === null) return filteredArcanas;
    return filteredArcanas.filter((a) => a.id === selectedArcanaId);
  }, [filteredArcanas, selectedArcanaId]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedArcanaId(null);
  }

  const sidebarItems = useMemo(() =>
    filteredArcanas.map((a) => ({
      id: a.id,
      title: a.name,
      subtitle: a.domain,
    })),
    [filteredArcanas],
  );

  return (
    <CatalogLayout
      sidebarHeaderTitle="Arcana"
      sidebarHeaderSubtitle="Arcanas globais e desta campanha"
      searchPlaceholder="Buscar arcana..."
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
          <ListSidebar
            ariaLabel="Lista de arcanas"
            items={sidebarItems}
            selectedItemId={selectedArcanaId}
            clearSelectionLabel="Mostrar todas"
            emptyMessage="Nenhuma arcana encontrada."
            onSelect={setSelectedArcanaId}
            onClearSelection={() => setSelectedArcanaId(null)}
          />
        )
      }
      mainContent={
        loading ? (
          <LoadingState message="Carregando arcanas..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : visibleArcanas.length === 0 ? (
          <p className={styles.empty}>Nenhuma arcana encontrada.</p>
        ) : (
          <ul className={styles.list}>
            {visibleArcanas.map((arcana) => (
              <li key={arcana.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{arcana.name}</h3>
                  <span className={styles.cardMeta}>{arcana.domain}</span>
                </div>

                {arcana.merge_effect ? (
                  <div className={styles.cardSection}>
                    <p className={styles.cardSectionLabel}>Fusão</p>
                    <p className={styles.cardBody}>{arcana.merge_effect}</p>
                  </div>
                ) : null}

                {arcana.dismiss_effect ? (
                  <div className={styles.cardSection}>
                    <p className={styles.cardSectionLabel}>Dispensa</p>
                    <p className={styles.cardBody}>{arcana.dismiss_effect}</p>
                  </div>
                ) : null}

                {arcana.special_rule ? (
                  <div className={styles.cardSection}>
                    <p className={styles.cardSectionLabel}>Regra especial</p>
                    <p className={styles.cardBody}>{arcana.special_rule}</p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )
      }
    />
  );
}
