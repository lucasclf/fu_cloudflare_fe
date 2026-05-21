import type { CSSProperties } from "react";
import { getScenarioImageSrc } from "../lib/get-scenario-image-src";
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
    return <div style={styles.empty}>Nenhuma entidade de cenário para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
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
    <article style={styles.card}>
      <div style={styles.imageFrame}>
        {imageSrc ? (
          <img src={imageSrc} alt={entity.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div style={styles.content}>
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

        <h2 style={styles.title}>{entity.name}</h2>

        {entity.tagline ? (
          <p style={styles.tagline}>“{entity.tagline}”</p>
        ) : null}

        <p style={styles.description}>
          {renderScenarioValue(entity.description)}
        </p>

        {isFaction(entity) ? (
          <div style={styles.relationsBlock}>
            <div style={styles.infoLabel}>Relações com locais</div>

            {entity.location_relations.length > 0 ? (
              <div style={styles.relationList}>
                {entity.location_relations.map((relation, index) => (
                  <div
                    key={`${relation.location_id}-${relation.relation_type}-${index}`}
                    style={styles.relationItem}
                  >
                    <span style={styles.relationLocation}>
                      {relation.location_name}
                    </span>
                    <span style={styles.relationType}>
                      {formatRelationType(relation.relation_type)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noRelations}>
                Sem relações com locais.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },

  card: {
    minHeight: "420px",
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  imageFrame: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#0e0c0a",
    borderBottom: "1px solid #3a2e22",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5f574c",
    fontSize: "13px",
    fontStyle: "italic",
  },

  content: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
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

  title: {
    margin: 0,
    color: "#e8c875",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  tagline: {
    margin: 0,
    color: "#9f8f73",
    fontSize: "14px",
    lineHeight: 1.45,
    fontStyle: "italic",
  },

  description: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },

  relationsBlock: {
    marginTop: "auto",
    borderTop: "1px solid #34291f",
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  infoLabel: {
    color: "#7a6e5a",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 800,
  },

  relationList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  relationItem: {
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  relationLocation: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 700,
  },

  relationType: {
    color: "#c9963a",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  noRelations: {
    color: "#7a6e5a",
    fontSize: "13px",
    fontStyle: "italic",
  },

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};