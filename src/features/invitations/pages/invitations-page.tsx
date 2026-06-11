import { useState } from "react";
import { Button } from "@/shared/components/button";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { useMyInvitations } from "../hooks/use-my-invitations";
import { acceptInvitation, declineInvitation } from "../api/respond-invitation";
import type { InvitationSummary } from "../types/invitation";
import "./invitations-page.css";

export function InvitationsPage() {
  const { data: invitations, loading, error, reload } = useMyInvitations();

  return (
    <div className="invitations-page">
      <header className="invitations-page__header">
        <h1 className="invitations-page__title">Meus convites</h1>
      </header>

      {loading ? <LoadingState /> : null}

      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && invitations !== null ? (
        invitations.length === 0 ? (
          <EmptyState title="Você não tem convites pendentes." />
        ) : (
          <ul className="invitations-page__list">
            {invitations.map((invitation) => (
              <InvitationItem key={invitation.id} invitation={invitation} onResolved={reload} />
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}

function InvitationItem({
  invitation,
  onResolved,
}: {
  invitation: InvitationSummary;
  onResolved: () => void;
}) {
  const [submitting, setSubmitting] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRespond(action: "accept" | "decline") {
    setSubmitting(action);
    setError(null);
    try {
      if (action === "accept") {
        await acceptInvitation(invitation.id);
      } else {
        await declineInvitation(invitation.id);
      }
      onResolved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível processar o convite.");
      setSubmitting(null);
    }
  }

  return (
    <li className="invitations-page__item">
      <div className="invitations-page__info">
        <span className="invitations-page__campaign">{invitation.campaign_name}</span>
        <span className="invitations-page__inviter">
          Convite de {invitation.inviter_nickname}
        </span>
        {error ? <span className="invitations-page__error">{error}</span> : null}
      </div>
      <div className="invitations-page__actions">
        <Button
          variant="primary"
          onClick={() => handleRespond("accept")}
          disabled={submitting !== null}
        >
          {submitting === "accept" ? "Aceitando..." : "Aceitar"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleRespond("decline")}
          disabled={submitting !== null}
        >
          {submitting === "decline" ? "Recusando..." : "Recusar"}
        </Button>
      </div>
    </li>
  );
}
