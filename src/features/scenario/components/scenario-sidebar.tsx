import { useMemo, useState } from "react";
import panelStyles from "./scenario-sidebar.module.css";
import {
  formatRelationType,
  isFaction,
  isLocation,
} from "../lib/scenario-formatters";
import type {
  ScenarioEntity,
  ScenarioFaction,
  ScenarioLocation,
} from "../types/scenario";

type Props = {
  entities: ScenarioEntity[];
  selectedEntityUid: string | null;
  onSelectEntity: (uid: string) => void;
};

function getLocationUidFromRelation(locationId: number): string {
  return `location-${locationId}`;
}

export function ScenarioSidebar({
  entities,
  selectedEntityUid,
  onSelectEntity,
}: Props) {
  const [expandedLocationUid, setExpandedLocationUid] = useState<string | null>(
    null,
  );

  const locations = useMemo(() => {
    return entities
      .filter(isLocation)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [entities]);

  const factionsByLocationUid = useMemo(() => {
    const map = new Map<string, ScenarioFaction[]>();

    const factions = entities.filter(isFaction);

    for (const faction of factions) {
      for (const relation of faction.location_relations ?? []) {
        const locationUid = getLocationUidFromRelation(relation.location_id);
        const current = map.get(locationUid) ?? [];

        if (!current.some((item) => item.uid === faction.uid)) {
          current.push(faction);
        }

        map.set(locationUid, current);
      }
    }

    for (const [locationUid, factionsForLocation] of map.entries()) {
      map.set(
        locationUid,
        factionsForLocation.sort((a, b) => a.name.localeCompare(b.name)),
      );
    }

    return map;
  }, [entities]);

  if (locations.length === 0) {
    return <div className={panelStyles.empty}>Nenhum local encontrado.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {locations.map((location) => {
        const relatedFactions = factionsByLocationUid.get(location.uid) ?? [];
        const expanded = expandedLocationUid === location.uid;

        return (
          <LocationItem
            key={location.uid}
            location={location}
            relatedFactions={relatedFactions}
            expanded={expanded}
            selectedEntityUid={selectedEntityUid}
            onSelectEntity={onSelectEntity}
            onToggle={() =>
              setExpandedLocationUid(expanded ? null : location.uid)
            }
          />
        );
      })}
    </div>
  );
}

type LocationItemProps = {
  location: ScenarioLocation;
  relatedFactions: ScenarioFaction[];
  expanded: boolean;
  selectedEntityUid: string | null;
  onSelectEntity: (uid: string) => void;
  onToggle: () => void;
};

function LocationItem({
  location,
  relatedFactions,
  expanded,
  selectedEntityUid,
  onSelectEntity,
  onToggle,
}: LocationItemProps) {
  return (
    <div className={panelStyles.locationBlock}>
      <button
        type="button"
        onClick={() => {
          onSelectEntity(location.uid);
          onToggle();
        }}
        className={[
          panelStyles.locationButton,
          selectedEntityUid === location.uid && panelStyles.locationButtonActive,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={panelStyles.locationContent}>
          <span className={panelStyles.locationName}>{location.name}</span>

          {location.tagline ? (
            <span className={panelStyles.locationTagline}>{location.tagline}</span>
          ) : null}
        </span>

        <span className={panelStyles.locationMeta}>
          {relatedFactions.length}
          <span aria-hidden="true" className={panelStyles.chevron}>
            {expanded ? "▾" : "▸"}
          </span>
        </span>
      </button>

      {expanded ? (
        <div className={panelStyles.factionList}>
          {relatedFactions.length > 0 ? (
            relatedFactions.map((faction) => (
              <FactionSubItem
                key={faction.uid}
                faction={faction}
                location={location}
                selected={selectedEntityUid === faction.uid}
                onSelect={() => onSelectEntity(faction.uid)}
              />
            ))
          ) : (
            <div className={panelStyles.noRelations}>Nenhuma facção relacionada.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

type FactionSubItemProps = {
  faction: ScenarioFaction;
  location: ScenarioLocation;
  selected: boolean;
  onSelect: () => void;
};

function FactionSubItem({
  faction,
  location,
  selected,
  onSelect,
}: FactionSubItemProps) {
  const relationTypes = (faction.location_relations ?? [])
    .filter(
      (relation) =>
        getLocationUidFromRelation(relation.location_id) === location.uid,
    )
    .map((relation) => formatRelationType(relation.relation_type));

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        panelStyles.factionSubItem,
        selected && panelStyles.factionSubItemActive,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={panelStyles.factionName}>{faction.name}</div>

      {relationTypes.length > 0 ? (
        <div className={panelStyles.relationBadges}>
          {relationTypes.map((relationType) => (
            <span key={relationType} className={panelStyles.relationBadge}>
              {relationType}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
