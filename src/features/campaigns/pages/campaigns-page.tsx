import { useState } from "react";
import { Button } from "@/shared/components/button";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { ConfirmationDialog } from "@/shared/components/confirmation-dialog";
import { useMyCampaigns } from "../hooks/use-my-campaigns";
import { CampaignCard } from "../components/campaign-card";
import { CreateCampaignForm } from "../components/create-campaign-form";
import { deleteCampaign } from "../api/delete-campaign";
import type { UserCampaign } from "../types/campaign";
import "./campaigns-page.css";

export function CampaignsPage() {
  const { data: campaigns, loading, error, reload } = useMyCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleCreated() {
    setShowCreateForm(false);
    reload();
  }

  async function handleConfirmDelete() {
    if (deletingId === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCampaign(deletingId);
      setDeletingId(null);
      reload();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Não foi possível deletar a campanha.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelDelete() {
    if (isDeleting) return;
    setDeletingId(null);
    setDeleteError(null);
  }

  const masterCampaigns = campaigns?.filter((c) => c.role === "master") ?? [];
  const playerCampaigns = campaigns?.filter((c) => c.role === "player") ?? [];

  const MASTER_LIMIT = 5;
  const masterLimitReached = !loading && campaigns !== null && masterCampaigns.length >= MASTER_LIMIT;

  const deletingCampaign = deletingId !== null
    ? campaigns?.find((c) => c.id === deletingId) ?? null
    : null;

  return (
    <div className="campaigns-page">
      <header className="campaigns-page__header">
        <h1 className="campaigns-page__title">Minhas campanhas</h1>
        {!showCreateForm ? (
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            disabled={loading || masterLimitReached}
            title={masterLimitReached ? `Limite de ${MASTER_LIMIT} campanhas como mestre atingido` : undefined}
          >
            Nova campanha
          </Button>
        ) : null}
      </header>

      {showCreateForm ? (
        <CreateCampaignForm
          onCreated={handleCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : null}

      {loading ? <LoadingState /> : null}

      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && campaigns !== null ? (
        <>
          <CampaignSection
            title="Como mestre"
            campaigns={masterCampaigns}
            emptyMessage="Você não é mestre de nenhuma campanha ainda."
            onDelete={(id) => setDeletingId(id)}
          />
          <CampaignSection
            title="Como jogador"
            campaigns={playerCampaigns}
            emptyMessage="Você não está em nenhuma campanha como jogador."
          />
        </>
      ) : null}

      {deletingId !== null ? (
        <ConfirmationDialog
          title="Deletar campanha"
          message={
            deletingCampaign
              ? `Tem certeza que deseja deletar "${deletingCampaign.name}"? Esta ação é irreversível e removerá todos os dados da campanha.`
              : "Tem certeza que deseja deletar esta campanha? Esta ação é irreversível."
          }
          confirmLabel="Deletar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
          error={deleteError}
        />
      ) : null}
    </div>
  );
}

type CampaignSectionProps = {
  title: string;
  campaigns: UserCampaign[];
  emptyMessage: string;
  onDelete?: (id: number) => void;
};

function CampaignSection({ title, campaigns, emptyMessage, onDelete }: CampaignSectionProps) {
  return (
    <section className="campaigns-page__section">
      <h2 className="campaigns-page__section-title">{title}</h2>
      {campaigns.length === 0 ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <ul className="campaigns-page__list">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                onDelete={onDelete ? () => onDelete(campaign.id) : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
