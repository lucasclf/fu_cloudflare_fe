import type { Item } from "../types/item";
import { ITEM_TYPE_LABELS } from "../types/item";
import { getItemImageSrc } from "../lib/get-item-image-src";

type Props = {
  item: Item;
};

function renderCategoryBadgeValue(value: string | null): string | null {
  if (value === null || value.length === 0) {
    return null;
  }

  const normalized = value.replaceAll("_", " ");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function renderDamageWithType(
  damage: string | null,
  damageType: string | null
): string {
  const resolvedDamage = renderValue(damage);

  if (damageType === null || damageType.length === 0) {
    return resolvedDamage;
  }

  return `${resolvedDamage} | ${renderCapitalizedValue(damageType)}`;
}

function renderCapitalizedValue(value: string | null): string {
  if (value === null) {
    return "—";
  }

  if (value.length === 0) {
    return "—";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderGripValue(value: string | null): string {
  if (value === null) {
    return "—";
  }

  if (value === "uma_mao") {
    return "Uma Mão";
  }

  if (value === "duas_maos") {
    return "Duas Mãos";
  }

  return value;
}

function renderDistanceValue(value: string | null): string {
  if (value === null) {
    return "—";
  }

  if (value === "corpo_a_corpo") {
    return "Corpo a Corpo";
  }

  if (value === "distancia") {
    return "Distância";
  }

  return value;
}

function hasDescription(value: string | null): value is string {
  return value !== null && value.trim().length > 0;
}

function renderValue(value: string | number | null): string {
  return value === null ? "—" : String(value);
}

export function ItemCard({ item }: Props) {
  const imageSrc = getItemImageSrc(item.url_key);

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerText}>
          <div style={styles.badges}>
            <div style={styles.badge}>{ITEM_TYPE_LABELS[item.item_type]}</div>

            {item.item_type === "arma" && item.weapon_category ? (
              <div style={styles.badge}>
                {renderCategoryBadgeValue(item.weapon_category)}
              </div>
            ) : null}
          </div>

          <h2 style={styles.title}>
            {item.name}
            {item.is_martial ? (
              <span style={styles.martialIcon} title="Item marcial">
                {" "}⛧
              </span>
            ) : null}
          </h2>

          {item.cost !== null && item.cost !== 0 ? (
            <div style={styles.costText}>{item.cost}z</div>
          ) : null}
        </div>

        <div style={styles.imageWrapper}>
          <img
            src={imageSrc}
            alt={item.name}
            style={styles.image}
          />
        </div>
      </div>

      <div style={styles.grid}>
        {item.item_type === "arma" ? (
          <>
            <Info
              label="Dano"
              value={renderDamageWithType(item.damage, item.damage_type)}
            />
            <Info label="Precisão" value={renderValue(item.accuracy)} />
            <Info label="Empunhadura" value={renderGripValue(item.grip)} />
            <Info
              label="Alcance"
              value={renderDistanceValue(item.distance)}
            />
            {hasDescription(item.description) ? (
              <Info label="Especial" value={item.description} fullWidth />
            ) : null}
          </>
        ) : null}

        {item.item_type === "armadura" || item.item_type === "escudo" ? (
  <>
          <div style={styles.statsGridThreeColumns}>
            <Info label="Defesa" value={renderValue(item.defense)} />
            <Info label="Defesa mágica" value={renderValue(item.magic_defense)} />
            <Info label="Iniciativa" value={renderValue(item.initiative)} />
          </div>

          {hasDescription(item.description) ? (
            <Info label="Especial" value={item.description} fullWidth />
          ) : null}
        </>
      ) : null}

        {item.item_type === "acessorio" ? (
          <>
            <Info label="Descrição" value={renderValue(item.description)} fullWidth />
          </>
        ) : null}

        {item.item_type === "artefato" || item.item_type === "outros" ? (
          <Info label="Descrição" value={renderValue(item.description)} fullWidth />
        ) : null}
      </div>
    </article>
  );
}

type InfoProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

function Info({ label, value, fullWidth = false }: InfoProps) {
  return (
    <div
      style={{
        ...styles.info,
        ...(fullWidth ? styles.infoFullWidth : {}),
      }}
    >
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "6px",
    padding: "20px",
  },
    costText: {
    marginTop: "8px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#c9963a",
  },
  header: {
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  badges: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#1e1a16",
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    color: "#c9963a",
    fontSize: "12px",
    marginBottom: "10px",
  },
  secondaryBadge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#241d18",
    border: "1px solid #5a4630",
    borderRadius: "999px",
    color: "#d4c9b0",
    fontSize: "12px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#e8c875",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4px",
  },
  martialIcon: {
    color: "#c0392b",
    fontSize: "22px",
    lineHeight: 1,
  },
  imageWrapper: {
    width: "88px",
    height: "88px",
    flexShrink: 0,
    border: "1px solid #3a2e22",
    borderRadius: "6px",
    background: "#1e1a16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "8px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  info: {
    background: "#1e1a16",
    border: "1px solid #3a2e22",
    borderRadius: "4px",
    padding: "10px 12px",
  },
  infoFullWidth: {
    gridColumn: "1 / -1",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#7a6e5a",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "4px",
  },
  infoValue: {
    color: "#d4c9b0",
    whiteSpace: "pre-wrap",
  },
    statsGridThreeColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    gridColumn: "1 / -1",
  },
};