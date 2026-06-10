import { useNavigate } from "react-router-dom";
import type { UserCampaign } from "../types/campaign";
import "./campaign-card.css";

type CampaignCardProps = {
  campaign: UserCampaign;
  onDelete?: () => void;
};

export function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/campaigns/${campaign.id}`);
  }

  return (
    <article
      className="campaign-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
    >
      {onDelete ? (
        <button
          type="button"
          className="campaign-card__delete"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Deletar campanha"
          aria-label={`Deletar campanha ${campaign.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      ) : null}

      <h3 className="campaign-card__name">{campaign.name}</h3>
      {campaign.description ? (
        <p className="campaign-card__description">{campaign.description}</p>
      ) : null}
    </article>
  );
}
