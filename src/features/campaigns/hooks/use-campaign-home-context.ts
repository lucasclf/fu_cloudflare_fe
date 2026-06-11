import { useOutletContext } from "react-router-dom";
import type { CampaignHome } from "../types/campaign";

export type CampaignHomeContext = {
  data: CampaignHome;
  reload: () => void;
  campaignId: number;
};

export function useCampaignHomeContext(): CampaignHomeContext {
  return useOutletContext<CampaignHomeContext>();
}
