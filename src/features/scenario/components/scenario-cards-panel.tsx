import { getScenarioImageSrc } from "../lib/get-scenario-image-src";
import panelStyles from "./scenario-cards-panel.module.css";
import {
  formatRelationType,
  formatScenarioEntityType,
  formatScenarioSubtype,
  isFaction,
  renderScenarioValue,
} from "../lib/scenario-formatters";
import type { ScenarioEntity } from "../types/scenario";

type Props = {
  entities: ScenarioEntity[];
};

export function ScenarioCardsPanel({ entities }: Props) {
  if (entities.length === 0) {
    return (
      <div className={panelStyles.empty}>Nenhuma entidade de cenário para exibir.</div>
    );
  }

  return (
    <div className={panelStyles.wrapper}>
      {entities.map((entity) => (
        <ScenarioCard key={entity.uid} entity={entity} />
      ))}
    </div>
  );
}

type ScenarioCardProps = {
  entity: ScenarioEntity;
};

function ScenarioCard({ entity }: ScenarioCardProps) {
  const imageSrc = getScenarioImageSrc(entity.type, entity.img_key);
  const subtypeLabel = formatScenarioSubtype(entity.type, entity.subtype);

  return (
    <article className={panelStyles.card}>
      <div className={panelStyles.imageFrame}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={entity.name}
            className={panelStyles.image}
            loading="lazy"
          />
        ) : (
          <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div className={panelStyles.content}>
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

        <h2 className={panelStyles.title}>{entity.name}</h2>

        {entity.tagline ? (
          <p className={panelStyles.tagline}>“{entity.tagline}”</p>
        ) : null}

        <p className={panelStyles.description}>
          {renderScenarioValue(entity.description)}
        </p>

        {isFaction(entity) ? (
          <div className={panelStyles.relationsBlock}>
            <div className={panelStyles.infoLabel}>Relações com locais</div>

            {(entity.location_relations ?? []).length > 0 ? (
              <div className={panelStyles.relationList}>
                {(entity.location_relations ?? []).map((relation, index) => (
                  <div
                    key={`${relation.location_id}-${relation.relation_type}-${index}`}
                    className={panelStyles.relationItem}
                  >
                    <span className={panelStyles.relationLocation}>
                      {relation.location_name}
                    </span>
                    <span className={panelStyles.relationType}>
                      {formatRelationType(relation.relation_type)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={panelStyles.noRelations}>Sem relações com locais.</div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
