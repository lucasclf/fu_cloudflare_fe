import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { useCampaignTopbar } from "@/app/layout/campaign-topbar-context";
import { useCampaignHome } from "../hooks/use-campaign-home";
import type { CampaignHomeContext } from "../hooks/use-campaign-home-context";

export function CampaignLayout() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const id = Number(campaignId);
  const { data, loading, error, reload } = useCampaignHome(id);
  const { setInfo } = useCampaignTopbar();

  useEffect(() => {
    if (!data) return;

    setInfo({ campaignId: id, campaignName: data.campaign.name });

    return () => setInfo(null);
  }, [id, data, setInfo]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Não foi possível carregar a campanha."} />;

  const context: CampaignHomeContext = { data, reload, campaignId: id };

  return <Outlet context={context} />;
}
