import { Outlet, useParams } from "react-router-dom";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { useCampaignHome } from "../hooks/use-campaign-home";
import type { CampaignHomeContext } from "../hooks/use-campaign-home-context";

export function CampaignLayout() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const id = Number(campaignId);
  const { data, loading, error, reload } = useCampaignHome(id);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Não foi possível carregar a campanha."} />;

  const context: CampaignHomeContext = { data, reload, campaignId: id };

  return <Outlet context={context} />;
}
