import { useMemo, useState } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { normalizeSearchText } from "@/shared/lib/text-formatters";
import { useEmptyResource, useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignSessions } from "../hooks/use-campaign-sessions";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";
import type { Session } from "../types/campaign";

import styles from "./campaign-simple-catalog-view.module.css";

type CampaignSessionsCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignSessionsCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignSessionsCatalogViewProps) {
  const global = useEmptyResource<Session>();
  const campaign = useCampaignSessions(campaignId);
  const { data: sessions, loading, error } = useCombinedCatalog(global, campaign);
  const sessionsList = useMemo(() => sessions ?? [], [sessions]);

  const [search, setSearch] = useState("");

  const filteredSessions = useMemo(() => {
    const query = normalizeSearchText(search);

    return sessionsList
      .filter((session) => {
        if (!query) return true;

        const searchableText = [
          session.title ?? "",
          session.summary,
          session.notes ?? "",
        ].join(" ");

        return normalizeSearchText(searchableText).includes(query);
      })
      .sort((a, b) => b.session_number - a.session_number);
  }, [sessionsList, search]);

  return (
    <CatalogLayout
      sidebarHeaderTitle="Sessões"
      sidebarHeaderSubtitle="Sessões registradas nesta campanha"
      searchPlaceholder="Buscar sessão..."
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <p className={styles.sidebarCount}>
            {filteredSessions.length} sessão(ões)
          </p>
        )
      }
      mainContent={
        loading ? (
          <LoadingState message="Carregando sessões..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredSessions.length === 0 ? (
          <p className={styles.empty}>Nenhuma sessão encontrada.</p>
        ) : (
          <ul className={styles.list}>
            {filteredSessions.map((session) => (
              <li key={session.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    #{session.session_number} — {session.title ?? "Sessão sem título"}
                  </h3>
                  <span className={styles.cardMeta}>
                    {formatDate(session.played_at)}
                  </span>
                </div>

                <p className={styles.cardBody}>{session.summary}</p>

                {session.notes ? (
                  <div className={styles.cardSection}>
                    <p className={styles.cardSectionLabel}>Notas</p>
                    <p className={styles.cardBody}>{session.notes}</p>
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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
