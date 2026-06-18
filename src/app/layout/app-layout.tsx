import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { GuestLoginButton } from "@/features/auth/components/guest-login-button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";

import "./app-layout.css";
import { CampaignTopbarProvider, useCampaignTopbarInfo } from "./campaign-topbar-context";

function AppLayoutTopbar() {
  const { status, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const campaignInfo = useCampaignTopbarInfo();

  const isCampaignHome = campaignInfo
    ? location.pathname === `/campaigns/${campaignInfo.campaignId}`
    : false;

  const showMyCampaignsLink =
    !campaignInfo && status === "authenticated" && location.pathname !== "/campaigns";

  return (
    <header className="app-layout__topbar">
      <div className="app-layout__campaign-info">
        {campaignInfo && !isCampaignHome ? (
          <button
            type="button"
            className="app-layout__campaign-back"
            onClick={() => navigate(`/campaigns/${campaignInfo.campaignId}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Voltar à campanha
          </button>
        ) : null}

        {campaignInfo ? (
          <span className="app-layout__campaign-name">{campaignInfo.campaignName}</span>
        ) : null}

        {showMyCampaignsLink ? (
          <button
            type="button"
            className="app-layout__campaign-back"
            onClick={() => navigate("/campaigns")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2.59 12.6a2 2 0 010-2.83l7.17-7.17a2 2 0 012.83 0l7.83 7.83a2 2 0 010 2.83z" />
              <circle cx="7.5" cy="7.5" r="1.5" />
            </svg>
            Minhas campanhas
          </button>
        ) : null}
      </div>

      {initializing ? null : status === "authenticated" ? (
        <UserMenu />
      ) : (
        <GuestLoginButton />
      )}
    </header>
  );
}

/**
 * Camada fina sobre as páginas autenticáveis (Home etc.): adiciona uma barra
 * fixa no topo com o menu do usuário (autenticado) ou um atalho para login
 * (visitante), além do nome da campanha atual quando aplicável. O conteúdo
 * recebe um espaçamento superior equivalente à altura da barra para não ficar
 * coberto por ela.
 */
export function AppLayout() {
  return (
    <CampaignTopbarProvider>
      <div className="app-layout">
        <AppLayoutTopbar />

        <div className="app-layout__content">
          <Outlet />
        </div>
      </div>
    </CampaignTopbarProvider>
  );
}
