import { useState } from "react";

import { CampaignEntitiesCatalog } from "../components/campaign-entities-catalog";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

export function CampaignEntitiesPage() {
  const { campaignId } = useCampaignHomeContext();
  const [category, setCategory] = useState<CampaignEntityCategory>("items");

  return (
    <CampaignEntitiesCatalog
      category={category}
      onCategoryChange={setCategory}
      campaignId={campaignId}
    />
  );
}
