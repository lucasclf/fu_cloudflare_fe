import { getScenarioImageSrc } from "../lib/get-scenario-image-src";
import panelStyles from "./scenario-detail-panel.module.css";
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
      <div className={panelStyles.wrapper}>
        <MainEntityCard entity={entity} />

        <SectionTitle>Facções Locais</SectionTitle>

        {relatedFactions.length > 0 ? (
          <div className={panelStyles.smallGrid}>
            {relatedFactions.map(({ faction, relationTypes }) => (
              <SmallFactionCard
                key={faction.uid}
                faction={faction}
                relationTypes={relationTypes}
              />
            ))}
          </div>
        ) : (
          <div className={panelStyles.empty}>
            Nenhuma facção relacionada a este local.
          </div>
        )}
      </div>
    );
  }

  const relatedLocations = getRelatedLocations(entity, entities);

  return (
    <div className={panelStyles.wrapper}>
      <MainEntityCard entity={entity} />

      <SectionTitle>Presente em</SectionTitle>

      {relatedLocations.length > 0 ? (
        <div className={panelStyles.smallGrid}>
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
        <div className={panelStyles.empty}>Nenhum local relacionado a esta facção.</div>
      )}
    </div>
  );
}

function MainEntityCard({ entity }: { entity: ScenarioEntity }) {
  const imageSrc = getScenarioImageSrc(entity.type, entity.img_key);
  const subtypeLabel = formatScenarioSubtype(entity.type, entity.subtype);

  return (
    <article className={panelStyles.mainCard}>
      <div className={panelStyles.mainImageFrame}>
        {imageSrc ? (
          <img src={imageSrc} alt={entity.name} className={panelStyles.mainImage} />
        ) : (
          <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div className={panelStyles.mainContent}>
        <div className={panelStyles.badges}>
          <span
            className={[
              panelStyles.typeBadge,
              entity.type === "location"
                ? panelStyles.locationBadge
                : panelStyles.factionBadge,
            ].join(" ")}
          >
            {formatScenarioEntityType(entity.type)}
          </span>

          {subtypeLabel ? (
            <span className={panelStyles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h2 className={panelStyles.mainTitle}>{entity.name}</h2>

        {entity.tagline ? (
          <p className={panelStyles.tagline}>“{entity.tagline}”</p>
        ) : null}

        <p className={panelStyles.description}>
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
    <article className={panelStyles.smallCard}>
      <SmallImage imageSrc={imageSrc} alt={faction.name} />

      <div className={panelStyles.smallContent}>
        <div className={panelStyles.badges}>
          <span className={[panelStyles.typeBadge, panelStyles.factionBadge].join(" ")}>
            Facção
          </span>

          {subtypeLabel ? (
            <span className={panelStyles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h3 className={panelStyles.smallTitle}>{faction.name}</h3>

        {faction.tagline ? (
          <p className={panelStyles.smallTagline}>“{faction.tagline}”</p>
        ) : null}

        <p className={panelStyles.smallDescription}>
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
    <article className={panelStyles.smallCard}>
      <SmallImage imageSrc={imageSrc} alt={location?.name ?? fallbackName} />

      <div className={panelStyles.smallContent}>
        <div className={panelStyles.badges}>
          <span className={[panelStyles.typeBadge, panelStyles.locationBadge].join(" ")}>
            Local
          </span>

          {subtypeLabel ? (
            <span className={panelStyles.secondaryBadge}>{subtypeLabel}</span>
          ) : null}
        </div>

        <h3 className={panelStyles.smallTitle}>{location?.name ?? fallbackName}</h3>

        {location?.tagline ? (
          <p className={panelStyles.smallTagline}>“{location.tagline}”</p>
        ) : null}

        <p className={panelStyles.smallDescription}>
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
    <div className={panelStyles.smallImageFrame}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className={panelStyles.smallImage} loading="lazy" />
      ) : (
        <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className={panelStyles.sectionTitleWrapper}>
      <div className={panelStyles.sectionDivider} />
      <h2 className={panelStyles.sectionTitle}>{children}</h2>
      <div className={panelStyles.sectionDivider} />
    </div>
  );
}

function RelationBadges({ relationTypes }: { relationTypes: string[] }) {
  if (relationTypes.length === 0) {
    return null;
  }

  return (
    <div className={panelStyles.relationBadges}>
      {relationTypes.map((relationType) => (
        <span key={relationType} className={panelStyles.relationBadge}>
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
        (faction.location_relations ?? [])
          .filter(
            (relation) => getLocationUid(relation.location_id) === location.uid,
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
