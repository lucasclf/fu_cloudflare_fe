import type { CSSProperties } from "react";
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
      <div style={styles.empty}>Nenhuma entidade de cenário para exibir.</div>
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

            {(entity.location_relations ?? []).length > 0 ? (
              <div style={styles.relationList}>
                {(entity.location_relations ?? []).map((relation, index) => (
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
              <div style={styles.noRelations}>Sem relações com locais.</div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    minHeight: "420px",
    background: "#131018",
    border: "1px solid #3d2d5c",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  imageFrame: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#0b0a0f",
    borderBottom: "1px solid #3d2d5c",
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
    color: "#8b7aa8",
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
    border: "1px solid rgba(74, 222, 128, 0.48)",
    background: "rgba(20, 83, 45, 0.22)",
    color: "#86efac",
  },

  factionBadge: {
    border: "1px solid #7c3aed",
    background: "#1c1826",
    color: "#a855f7",
  },

  secondaryBadge: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #3d2d5c",
    borderRadius: "999px",
    background: "#0b0a0f",
    color: "#8b7aa8",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  title: {
    margin: 0,
    color: "#c084fc",
    fontSize: "22px",
    lineHeight: 1.15,
  },

  tagline: {
    margin: 0,
    color: "#8b7aa8",
    fontSize: "14px",
    lineHeight: 1.45,
    fontStyle: "italic",
  },

  description: {
    margin: 0,
    color: "#e2d9f3",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },

  relationsBlock: {
    marginTop: "auto",
    borderTop: "1px solid #3d2d5c",
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  infoLabel: {
    color: "#8b7aa8",
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
    border: "1px solid #3d2d5c",
    borderRadius: "8px",
    background: "#0b0a0f",
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  relationLocation: {
    color: "#e2d9f3",
    fontSize: "13px",
    fontWeight: 700,
  },

  relationType: {
    color: "#a855f7",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  noRelations: {
    color: "#8b7aa8",
    fontSize: "13px",
    fontStyle: "italic",
  },

  empty: {
    color: "#8b7aa8",
    fontStyle: "italic",
  },
};
