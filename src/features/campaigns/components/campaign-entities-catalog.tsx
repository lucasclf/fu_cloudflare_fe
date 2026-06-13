import { CampaignItemsCatalogView } from "./campaign-items-catalog-view";
import { CampaignSpellsCatalogView } from "./campaign-spells-catalog-view";
import { CampaignPowersCatalogView } from "./campaign-powers-catalog-view";
import { CampaignJobsCatalogView } from "./campaign-jobs-catalog-view";
import { CampaignMonstersCatalogView } from "./campaign-monsters-catalog-view";
import { CampaignNpcsCatalogView } from "./campaign-npcs-catalog-view";
import { CampaignPcsCatalogView } from "./campaign-pcs-catalog-view";
import { CampaignScenarioCatalogView } from "./campaign-scenario-catalog-view";
import { CampaignSessionsCatalogView } from "./campaign-sessions-catalog-view";
import { CampaignArcanasCatalogView } from "./campaign-arcanas-catalog-view";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";

type CampaignEntitiesCatalogProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignEntitiesCatalog({
  category,
  onCategoryChange,
  campaignId,
}: CampaignEntitiesCatalogProps) {
  switch (category) {
    case "items":
      return (
        <CampaignItemsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "spells":
      return (
        <CampaignSpellsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "powers":
      return (
        <CampaignPowersCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "classes":
      return (
        <CampaignJobsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "bestiary":
      return (
        <CampaignMonstersCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "npcs":
      return (
        <CampaignNpcsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "characters":
      return (
        <CampaignPcsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "scenario":
      return (
        <CampaignScenarioCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "sessions":
      return (
        <CampaignSessionsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    case "arcanas":
      return (
        <CampaignArcanasCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
          campaignId={campaignId}
        />
      );

    default:
      return null;
  }
}
