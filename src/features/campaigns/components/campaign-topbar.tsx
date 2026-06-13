import { useNavigate, useLocation } from "react-router-dom";

import "./campaign-topbar.css";

type CampaignTopbarProps = {
  campaignId: number;
  campaignName: string;
};

export function CampaignTopbar({ campaignId, campaignName }: CampaignTopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isCampaignHome = location.pathname === `/campaigns/${campaignId}`;

  return (
    <div className="campaign-topbar">
      {!isCampaignHome ? (
        <button
          type="button"
          className="campaign-topbar__back"
          onClick={() => navigate(`/campaigns/${campaignId}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar à campanha
        </button>
      ) : null}

      <span className="campaign-topbar__name">{campaignName}</span>
    </div>
  );
}
