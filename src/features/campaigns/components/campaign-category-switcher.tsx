import { SelectField } from "@/shared/components/select-field";
import {
  CAMPAIGN_ENTITY_CATEGORY_OPTIONS,
  type CampaignEntityCategory,
} from "../types/campaign-entity-category";

type CampaignCategorySwitcherProps = {
  value: CampaignEntityCategory;
  onChange: (value: CampaignEntityCategory) => void;
};

export function CampaignCategorySwitcher({ value, onChange }: CampaignCategorySwitcherProps) {
  return (
    <SelectField
      id="campaign-entity-category"
      label="Categoria"
      value={value}
      options={CAMPAIGN_ENTITY_CATEGORY_OPTIONS}
      onChange={onChange}
    />
  );
}
