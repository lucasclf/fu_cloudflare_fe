import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "@/shared/components/confirmation-dialog";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { PcCard } from "../components/pc-card";
import { InviteSearch } from "../components/invite-search";
import { cancelInvitation } from "../api/cancel-invitation";
import type { CampaignHomeMaster, CampaignHomePlayer, RecentSession, MemberWithNickname, PendingInvitation } from "../types/campaign";
import "./campaign-home-page.css";

const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  hiatus: "Em pausa",
  completed: "Concluída",
};

export function CampaignHomePage() {
  const navigate = useNavigate();
  const { data, reload, campaignId: id } = useCampaignHomeContext();

  return (
    <div className="campaign-home">
      <header className="campaign-home__header">
        <button
          type="button"
          className="campaign-home__back"
          onClick={() => navigate("/campaigns")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Minhas campanhas
        </button>
        <div className="campaign-home__header-actions">
          <button
            type="button"
            className="campaign-home__manage-button"
            onClick={() => navigate(`/campaigns/${id}/entities`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2.59 12.6a2 2 0 010-2.83l7.17-7.17a2 2 0 012.83 0l7.83 7.83a2 2 0 010 2.83z" />
              <circle cx="7.5" cy="7.5" r="1.5" />
            </svg>
            Entidades
          </button>
          <button
            type="button"
            className="campaign-home__manage-button"
            onClick={() => navigate(`/campaigns/${id}/manage`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Administrar
          </button>
          <span className={`campaign-home__role-badge campaign-home__role-badge--${data.role}`}>
            {data.role === "master" ? "Mestre" : "Jogador"}
          </span>
        </div>
      </header>

      <div className="campaign-home__title-row">
        <div className="campaign-home__title-line">
          <h1 className="campaign-home__title">{data.campaign.name}</h1>
          <span className={`campaign-home__status campaign-home__status--${data.campaign.status}`}>
            {STATUS_LABEL[data.campaign.status] ?? data.campaign.status}
          </span>
        </div>
        {data.campaign.description ? (
          <p className="campaign-home__description">{data.campaign.description}</p>
        ) : null}
      </div>

      {data.role === "master" ? (
        <MasterView data={data} onInvited={reload} />
      ) : (
        <PlayerView data={data} />
      )}
    </div>
  );
}

function MasterView({ data, onInvited }: { data: CampaignHomeMaster; onInvited: () => void }) {
  return (
    <div className="campaign-home__layout">
      <main className="campaign-home__main">
        <section className="campaign-home__section">
          <h2 className="campaign-home__section-title">Estatísticas</h2>
          <ul className="campaign-home__stats">
            <StatBadge value={data.stats.memberCount} label="Membros" />
            <StatBadge value={data.stats.sessionCount} label="Sessões" />
            <StatBadge value={data.stats.pcCount} label="PCs" />
            <StatBadge value={data.stats.npcCount} label="NPCs" />
            <StatBadge value={data.stats.locationCount} label="Locais" />
            <StatBadge value={data.stats.factionCount} label="Facções" />
            <StatBadge value={data.stats.monsterCount} label="Monstros" />
          </ul>
        </section>

        <SessionList sessions={data.recentSessions} />

        <section className="campaign-home__section">
          <h2 className="campaign-home__section-title">Convidar jogador</h2>
          <InviteSearch campaignId={data.campaign.id} onInvited={onInvited} />
        </section>

        {data.campaign.master_notes !== null ? (
          <section className="campaign-home__section">
            <h2 className="campaign-home__section-title">Notas do mestre</h2>
            <p className="campaign-home__notes">{data.campaign.master_notes || <em className="campaign-home__notes-empty">Nenhuma nota registrada.</em>}</p>
          </section>
        ) : null}
      </main>

      <aside className="campaign-home__aside">
        <MemberList members={data.members} />

        {data.pendingInvitations.length > 0 ? (
          <section className="campaign-home__section campaign-home__section--aside">
            <h2 className="campaign-home__section-title">Convites pendentes</h2>
            <ul className="campaign-home__invitations">
              {data.pendingInvitations.map((inv) => (
                <PendingInvitationItem
                  key={inv.id}
                  invitation={inv}
                  campaignId={data.campaign.id}
                  onCancelled={onInvited}
                />
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
    </div>
  );
}

function PlayerView({ data }: { data: CampaignHomePlayer }) {
  return (
    <div className="campaign-home__layout">
      <main className="campaign-home__main">
        {data.myPcs.length > 0 ? (
          <section className="campaign-home__section">
            <h2 className="campaign-home__section-title">
              {data.myPcs.length === 1 ? "Meu personagem" : "Meus personagens"}
            </h2>
            <div className="campaign-home__pcs">
              {data.myPcs.map((pc) => (
                <PcCard key={pc.id} pc={pc} />
              ))}
            </div>
          </section>
        ) : (
          <section className="campaign-home__section">
            <h2 className="campaign-home__section-title">Meu personagem</h2>
            <p className="campaign-home__empty">Você ainda não tem um personagem nesta campanha.</p>
          </section>
        )}

        <SessionList sessions={data.recentSessions} />
      </main>

      <aside className="campaign-home__aside">
        <section className="campaign-home__section campaign-home__section--aside">
          <h2 className="campaign-home__section-title">Campanha</h2>
          <p className="campaign-home__aside-meta">
            Mestre: <strong>{data.masterNickname}</strong>
          </p>
          <p className="campaign-home__aside-meta">
            {data.memberCount} {data.memberCount === 1 ? "membro" : "membros"}
          </p>
        </section>
      </aside>
    </div>
  );
}

function MemberList({ members }: { members: MemberWithNickname[] }) {
  const master = members.filter((m) => m.role === "master");
  const players = members.filter((m) => m.role === "player");

  return (
    <section className="campaign-home__section campaign-home__section--aside">
      <h2 className="campaign-home__section-title">Membros</h2>
      <ul className="campaign-home__members">
        {master.map((m) => (
          <MemberItem key={m.user_id} member={m} />
        ))}
        {players.map((m) => (
          <MemberItem key={m.user_id} member={m} />
        ))}
      </ul>
    </section>
  );
}

function MemberItem({ member }: { member: MemberWithNickname }) {
  return (
    <li className="campaign-home__member">
      <div className="campaign-home__member-info">
        <span className="campaign-home__member-nickname">{member.nickname}</span>
        {member.pc_name ? (
          <span className="campaign-home__member-pc">{member.pc_name}</span>
        ) : member.role === "player" ? (
          <span className="campaign-home__member-pc campaign-home__member-pc--empty">sem personagem</span>
        ) : null}
      </div>
      <span className={`campaign-home__member-role campaign-home__member-role--${member.role}`}>
        {member.role === "master" ? "Mestre" : "Jogador"}
      </span>
    </li>
  );
}

function SessionList({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <section className="campaign-home__section">
      <h2 className="campaign-home__section-title">Últimas sessões</h2>
      <ul className="campaign-home__sessions">
        {sessions.map((s) => (
          <li key={s.id} className="campaign-home__session">
            <span className="campaign-home__session-number">#{s.session_number}</span>
            <span className="campaign-home__session-title">
              {s.title ?? "Sessão sem título"}
            </span>
            <span className="campaign-home__session-date">
              {formatDate(s.played_at)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatBadge({ value, label }: { value: number; label: string }) {
  return (
    <li className="campaign-home__stat">
      <span className="campaign-home__stat-value">{value}</span>
      <span className="campaign-home__stat-label">{label}</span>
    </li>
  );
}

function PendingInvitationItem({
  invitation,
  campaignId,
  onCancelled,
}: {
  invitation: PendingInvitation;
  campaignId: number;
  onCancelled: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setCancelling(true);
    setError(null);
    try {
      await cancelInvitation(campaignId, invitation.id);
      setConfirming(false);
      onCancelled();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível cancelar o convite.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <li className="campaign-home__invitation">
      <span className="campaign-home__invitation-nickname">{invitation.invitee_nickname}</span>
      <span className="campaign-home__invitation-status">Pendente</span>
      <button
        type="button"
        className="campaign-home__invitation-cancel"
        title="Cancelar convite"
        aria-label="Cancelar convite"
        onClick={() => setConfirming(true)}
      >
        ×
      </button>

      {confirming ? (
        <ConfirmationDialog
          title="Cancelar convite"
          message={`Cancelar o convite enviado para ${invitation.invitee_nickname}?`}
          confirmLabel="Cancelar convite"
          cancelLabel="Voltar"
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
          isLoading={cancelling}
          error={error}
        />
      ) : null}
    </li>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}
