import type { CSSProperties } from "react";
import { getScenarioImageSrc } from "../lib/get-scenario-image-src";
import {
  formatRelationType,
  formatScenarioEntityType,
  formatScenarioSubtype,
  isFaction,
  isLocation,
  renderScenarioValue,
} from "../lib/scenario-formatters";
import type {
  ScenarioEntity,
  ScenarioFaction,
  ScenarioLocation,
  ScenarioLocationRelation,
} from "../types/scenario";

type Props = {
  entity: ScenarioEntity;
  entities: ScenarioEntity[];
};

export function ScenarioDetailPanel({ entity, entities }: Props) {
  if (isLocation(entity)) {
    const relatedFactions = getRelatedFactions(entity, entities);

    return (
      <div style={styles.wrapper}>
        <MainEntityCard entity={entity} />

        <SectionTitle>Facções Locais</SectionTitle>

        {relatedFactions.length > 0 ? (
          <div style={styles.smallGrid}>
            {relatedFactions.map(({ faction, relationTypes }) => (
              <SmallFactionCard
                key={faction.uid}
                faction={faction}
                relationTypes={relationTypes}
              />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>Nenhuma facção relacionada a este local.</div>
        )}
      </div>
    );
  }

  const relatedLocations = getRelatedLocations(entity, entities);

  return (
    <div style={styles.wrapper}>
      <MainEntityCard entity={entity} />

      <SectionTitle>Presente em</SectionTitle>

      {relatedLocations.length > 0 ? (
        <div style={styles.smallGrid}>
          {relatedLocations.map(({ location, fallbackName, relationTypes }) => (
            <SmallLocationCard
              key={location?.uid ?? fallbackName}
              location={location}
              fallbackName={fallbackName}
              relationTypes={relationTypes}
            />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>Nenhum local relacionado a esta facção.</div>
      )}
    </div>
  );
}

function MainEntityCard({ entity }: { entity: ScenarioEntity }) {
  const imageSrc = getScenarioImageSrc(entity.type, entity.img_key);
  const subtypeLabel = formatScenarioSubtype(entity.type, entity.subtype);

  return (
    <article style={styles.mainCard}>
      <div style={styles.mainImageFrame}>
        {imageSrc ? (
          <img src={imageSrc} alt={entity.name} style={styles.mainImage} />
        ) : (
          <div style={styles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div style={styles.mainContent}>
        <div style={styles.badges}>
          <span
            style={{
              ...styles.typeBadge,
              ...(entity.type === "location"
                ? styles.locationBadge
                : styles.factionBadge),
            }}
          >
            {formatScenarioEntityType(entity.type)}
          </span>

          {subtypeLabel ? (
            <span style={styles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h2 style={styles.mainTitle}>{entity.name}</h2>

        {entity.tagline ? (
          <p style={styles.tagline}>“{entity.tagline}”</p>
        ) : null}

        <p style={styles.description}>
          {renderScenarioValue(entity.description)}
        </p>
      </div>
    </article>
  );
}

function SmallFactionCard({
  faction,
  relationTypes,
}: {
  faction: ScenarioFaction;
  relationTypes: string[];
}) {
  const imageSrc = getScenarioImageSrc(faction.type, faction.img_key);
  const subtypeLabel = formatScenarioSubtype(faction.type, faction.subtype);

  return (
    <article style={styles.smallCard}>
      <SmallImage imageSrc={imageSrc} alt={faction.name} />

      <div style={styles.smallContent}>
        <div style={styles.badges}>
          <span style={{ ...styles.typeBadge, ...styles.factionBadge }}>
            Facção
          </span>

          {subtypeLabel ? (
            <span style={styles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h3 style={styles.smallTitle}>{faction.name}</h3>

        {faction.tagline ? (
          <p style={styles.smallTagline}>“{faction.tagline}”</p>
        ) : null}

        <p style={styles.smallDescription}>
          {renderScenarioValue(faction.description)}
        </p>

        <RelationBadges relationTypes={relationTypes} />
      </div>
    </article>
  );
}

function SmallLocationCard({
  location,
  fallbackName,
  relationTypes,
}: {
  location: ScenarioLocation | undefined;
  fallbackName: string;
  relationTypes: string[];
}) {
  const imageSrc = location
    ? getScenarioImageSrc(location.type, location.img_key)
    : null;

  const subtypeLabel = location
    ? formatScenarioSubtype(location.type, location.subtype)
    : null;

  return (
    <article style={styles.smallCard}>
      <SmallImage imageSrc={imageSrc} alt={location?.name ?? fallbackName} />

      <div style={styles.smallContent}>
        <div style={styles.badges}>
          <span style={{ ...styles.typeBadge, ...styles.locationBadge }}>
            Local
          </span>

          {subtypeLabel ? (
            <span style={styles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h3 style={styles.smallTitle}>{location?.name ?? fallbackName}</h3>

        {location?.tagline ? (
          <p style={styles.smallTagline}>“{location.tagline}”</p>
        ) : null}

        <p style={styles.smallDescription}>
          {location
            ? renderScenarioValue(location.description)
            : "Local referenciado pela facção, mas não encontrado na lista principal."}
        </p>

        <RelationBadges relationTypes={relationTypes} />
      </div>
    </article>
  );
}

function SmallImage({
  imageSrc,
  alt,
}: {
  imageSrc: string | null;
  alt: string;
}) {
  return (
    <div style={styles.smallImageFrame}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} style={styles.smallImage} />
      ) : (
        <div style={styles.imagePlaceholder}>Sem imagem</div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={styles.sectionTitleWrapper}>
      <div style={styles.sectionDivider} />
      <h2 style={styles.sectionTitle}>{children}</h2>
      <div style={styles.sectionDivider} />
    </div>
  );
}

function RelationBadges({ relationTypes }: { relationTypes: string[] }) {
  if (relationTypes.length === 0) {
    return null;
  }

  return (
    <div style={styles.relationBadges}>
      {relationTypes.map((relationType) => (
        <span key={relationType} style={styles.relationBadge}>
          {relationType}
        </span>
      ))}
    </div>
  );
}

function getLocationUid(locationId: number): string {
  return `location-${locationId}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function getRelatedFactions(
  location: ScenarioLocation,
  entities: ScenarioEntity[],
): Array<{
  faction: ScenarioFaction;
  relationTypes: string[];
}> {
  return entities
    .filter(isFaction)
    .map((faction) => {
      const relationTypes = unique(
        faction.location_relations
          .filter(
            (relation) =>
              getLocationUid(relation.location_id) === location.uid,
          )
          .map((relation) => formatRelationType(relation.relation_type)),
      );

      return {
        faction,
        relationTypes,
      };
    })
    .filter((item) => item.relationTypes.length > 0)
    .sort((a, b) => a.faction.name.localeCompare(b.faction.name));
}

function getRelatedLocations(
  faction: ScenarioFaction,
  entities: ScenarioEntity[],
): Array<{
  location: ScenarioLocation | undefined;
  fallbackName: string;
  relationTypes: string[];
}> {
  const locationsByUid = new Map(
    entities.filter(isLocation).map((location) => [location.uid, location]),
  );

  const relationsByLocationUid = new Map<string, ScenarioLocationRelation[]>();

  for (const relation of faction.location_relations ?? []) {
    const locationUid = getLocationUid(relation.location_id);
    const current = relationsByLocationUid.get(locationUid) ?? [];

    current.push(relation);
    relationsByLocationUid.set(locationUid, current);
  }

  return Array.from(relationsByLocationUid.entries())
    .map(([locationUid, relations]) => {
      const location = locationsByUid.get(locationUid);

      return {
        location,
        fallbackName: relations[0]?.location_name ?? "Local desconhecido",
        relationTypes: unique(
          relations.map((relation) =>
            formatRelationType(relation.relation_type),
          ),
        ),
      };
    })
    .sort((a, b) =>
      (a.location?.name ?? a.fallbackName).localeCompare(
        b.location?.name ?? b.fallbackName,
      ),
    );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },

  mainCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "12px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "minmax(260px, 38%) minmax(0, 1fr)",
    minHeight: "360px",
  },

  mainImageFrame: {
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
    minHeight: "360px",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    minHeight: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5f574c",
    fontSize: "13px",
    fontStyle: "italic",
  },

  mainContent: {
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  badges: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
  },

  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  locationBadge: {
    border: "1px solid #516744",
    background: "#141f12",
    color: "#aad18f",
  },

  factionBadge: {
    border: "1px solid #7a5a22",
    background: "#1e1a16",
    color: "#c9963a",
  },

  secondaryBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  mainTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "34px",
    lineHeight: 1.05,
  },

  tagline: {
    margin: 0,
    color: "#9f8f73",
    fontSize: "16px",
    lineHeight: 1.5,
    fontStyle: "italic",
  },

  description: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "15px",
    lineHeight: 1.65,
    whiteSpace: "pre-line",
  },

  sectionTitleWrapper: {
    margin: "34px 0 18px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "18px",
  },

  sectionDivider: {
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(201, 150, 58, 0.7), transparent)",
  },

  sectionTitle: {
    margin: 0,
    color: "#e8c875",
    fontFamily: `"Cinzel", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAlign: "center",
    textShadow: "0 0 18px rgba(201, 150, 58, 0.25)",
  },

  smallGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  smallCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "360px",
  },

  smallImageFrame: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#0e0c0a",
    borderBottom: "1px solid #3a2e22",
    overflow: "hidden",
  },

  smallImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  smallContent: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },

  smallTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "18px",
    lineHeight: 1.15,
  },

  smallTagline: {
    margin: 0,
    color: "#9f8f73",
    fontSize: "13px",
    lineHeight: 1.4,
    fontStyle: "italic",
  },

  smallDescription: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "13px",
    lineHeight: 1.5,
    whiteSpace: "pre-line",
    flex: 1,
  },

  relationBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "auto",
  },

  relationBadge: {
    border: "1px solid #4c3922",
    borderRadius: "999px",
    color: "#c9963a",
    background: "#1e1a16",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: 700,
  },

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};