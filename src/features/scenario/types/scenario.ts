export type ScenarioEntityType = "location" | "faction";

export type ScenarioLocationRelation = {
  location_id: number;
  location_name: string;
  relation_type: string;
};

export type ScenarioEntityBase = {
  uid: string;
  id: number;
  type: ScenarioEntityType;
  name: string;
  tagline: string | null;
  description: string | null;
  img_key: string | null;
  subtype: string | null;
};

export type ScenarioLocation = ScenarioEntityBase & {
  type: "location";
};

export type ScenarioFaction = ScenarioEntityBase & {
  type: "faction";
  location_relations: ScenarioLocationRelation[];
};

export type ScenarioEntity = ScenarioLocation | ScenarioFaction;