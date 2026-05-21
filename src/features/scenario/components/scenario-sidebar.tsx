import { useMemo, useState, type CSSProperties } from "react";
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
    return <div style={styles.empty}>Nenhum local encontrado.</div>;
  }

  return (
    <div style={styles.wrapper}>
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
    <div style={styles.locationBlock}>
      <button
        type="button"
        onClick={() => {
          onSelectEntity(location.uid);
          onToggle();
        }}
        style={{
          ...styles.locationButton,
          ...(selectedEntityUid === location.uid
            ? styles.locationButtonActive
            : {}),
        }}
      >
        <span style={styles.locationContent}>
          <span style={styles.locationName}>{location.name}</span>

          {location.tagline ? (
            <span style={styles.locationTagline}>{location.tagline}</span>
          ) : null}
        </span>

        <span style={styles.locationMeta}>
          {relatedFactions.length}
          <span aria-hidden="true" style={styles.chevron}>
            {expanded ? "▾" : "▸"}
          </span>
        </span>
      </button>

      {expanded ? (
        <div style={styles.factionList}>
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
            <div style={styles.noRelations}>Nenhuma facção relacionada.</div>
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
  const relationTypes = faction.location_relations
    .filter(
      (relation) =>
        getLocationUidFromRelation(relation.location_id) === location.uid,
    )
    .map((relation) => formatRelationType(relation.relation_type));

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        ...styles.factionSubItem,
        ...(selected ? styles.factionSubItemActive : {}),
      }}
    >
      <div style={styles.factionName}>{faction.name}</div>

      {relationTypes.length > 0 ? (
        <div style={styles.relationBadges}>
          {relationTypes.map((relationType) => (
            <span key={relationType} style={styles.relationBadge}>
              {relationType}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    padding: "0 12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  locationBlock: {
    border: "1px solid #34291f",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#110e0c",
  },

  locationButton: {
    width: "100%",
    border: 0,
    background: "transparent",
    color: "#d4c9b0",
    padding: "10px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    cursor: "pointer",
    textAlign: "left",
  },

  locationContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  locationName: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 800,
    lineHeight: 1.2,
  },

  locationTagline: {
    color: "#7a6e5a",
    fontSize: "12px",
    lineHeight: 1.35,
  },

  locationMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#9f8f73",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },

  chevron: {
    color: "#c9963a",
    fontSize: "12px",
  },

  factionList: {
    borderTop: "1px solid #34291f",
    background: "#15110f",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  factionSubItem: {
    border: 0,
    borderLeft: "2px solid #7a5a22",
    background: "transparent",
    padding: "4px 0 4px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
    textAlign: "left",
  },

  factionName: {
    color: "#d4c9b0",
    fontSize: "12px",
    fontWeight: 700,
  },

  relationBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },

  relationBadge: {
    border: "1px solid #4c3922",
    borderRadius: "999px",
    color: "#c9963a",
    background: "#1e1a16",
    padding: "2px 7px",
    fontSize: "10px",
    fontWeight: 700,
  },

  noRelations: {
    color: "#7a6e5a",
    fontSize: "12px",
    fontStyle: "italic",
  },

  empty: {
    padding: "12px 16px 16px",
    color: "#7a6e5a",
    fontStyle: "italic",
  },

  locationButtonActive: {
    background: "#1e1a16",
    boxShadow: "inset 3px 0 0 #c9963a",
  },

  factionSubItemActive: {
    background: "#1e1a16",
    borderLeftColor: "#c9963a",
    borderRadius: "0 6px 6px 0",
  },
};