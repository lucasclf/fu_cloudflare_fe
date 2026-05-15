import type { CSSProperties } from "react";
import { getNpcImageSrc } from "../lib/get-npc-image-src";
import {
  formatEquipmentSlot,
  formatInventoryRelationType,
  formatNpcCurrency,
  formatNpcItemType,
  formatDamageType,
  formatMartialValue,
  formatNpcItemValue,
  formatSpecialRuleType,
  formatWeaponDistance,
  formatWeaponGrip,
  renderNpcValue,
} from "../lib/npc-formatters";
import type {
  NpcDetail,
  NpcEquipmentItem,
  NpcInventoryItem,
  NpcItem,
  NpcSpecialRule,
} from "../types/npc";
import { getItemImageSrc } from "../../items/lib/get-item-image-src";
import { formatItemDefenseValue } from "../../items/lib/item-formatters.ts";

type Props = {
  npc: NpcDetail;
  onBackToList: () => void;
};

export function NpcDetailPanel({ npc, onBackToList }: Props) {
  const imageSrc = getNpcImageSrc(npc.img_key);

  return (
    <div style={styles.wrapper}>
      <button type="button" onClick={onBackToList} style={styles.backButton}>
        ← Voltar para NPCs
      </button>

      <article style={styles.heroCard}>
        <div style={styles.imageFrame}>
          {imageSrc ? (
            <img src={imageSrc} alt={npc.name} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>Sem imagem</div>
          )}
        </div>

        <div style={styles.heroContent}>
          <div style={styles.heroInfoBlock}>
            <h2 style={styles.title}>{npc.name}</h2>

            <p style={styles.tagline}>“{renderNpcValue(npc.tagline)}”</p>

            <p style={styles.description}>
              {renderNpcValue(npc.description)}
            </p>
          </div>

          <div style={styles.heroStatsBlock}>
            <NpcStats npc={npc} />
          </div>
        </div>
      </article>

      {npc.specialRules.length > 0 ? (
        <section style={styles.section}>
          <SectionTitle>Regras Especiais</SectionTitle>

          <div style={styles.ruleGrid}>
            {npc.specialRules.map((rule) => (
              <SpecialRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </section>
      ) : null}

      {npc.inventory.length > 0 ? (
        <section style={styles.section}>
          <SectionTitle>Inventário</SectionTitle>

          <div style={styles.itemGrid}>
            {npc.inventory.map((item) => (
              <InventoryCard
                key={`${item.item.id}-${item.relation_type}`}
                item={item}
              />
            ))}
          </div>
        </section>
      ) : null}

      {npc.equipment.length > 0 ? (
        <section style={styles.section}>
          <SectionTitle>Equipamentos</SectionTitle>

          <div style={styles.itemGrid}>
            {npc.equipment.map((item) => (
              <EquipmentCard
                key={`${item.item.id}-${item.slot}`}
                item={item}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function NpcStats({ npc }: { npc: NpcDetail }) {
  return (
    <div style={styles.stats}>
      <div style={styles.statRowFour}>
        <Stat label="DES" value={npc.dexterity_die} />
        <Stat label="AST" value={npc.insight_die} />
        <Stat label="VIG" value={npc.might_die} />
        <Stat label="VON" value={npc.willpower_die} />
      </div>

      <div style={styles.statRowThree}>
        <Stat label="PV" value={npc.hp} />
        <Stat label="PM" value={npc.mp} />
        <Stat label="Nível" value={npc.level} />
      </div>

      <div style={styles.statRowThree}>
        <Stat label="DEF" value={npc.defense} />
        <Stat label="DEF M." value={npc.magic_defense} />
        <Stat label="INI" value={npc.initiative} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{renderNpcValue(value)}</span>
    </div>
  );
}

function SpecialRuleCard({ rule }: { rule: NpcSpecialRule }) {
  const metadataEntries = rule.metadata ? Object.entries(rule.metadata) : [];

  return (
    <article style={styles.ruleCard}>
      <div style={styles.badges}>
        <span style={styles.typeBadge}>{formatSpecialRuleType(rule.type)}</span>
      </div>

      <h3 style={styles.cardTitle}>{rule.title}</h3>

      <p style={styles.cardDescription}>{rule.description}</p>

      {metadataEntries.length > 0 ? (
        <div style={styles.metadataList}>
          {metadataEntries.map(([key, value]) => (
            <span key={key} style={styles.metadataBadge}>
              {key}: {String(value)}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function InventoryCard({ item }: { item: NpcInventoryItem }) {
  const shouldShowPrice = item.relation_type === "shop_stock";

  return (
    <NpcItemCard
      item={item.item}
      headerLabel={formatInventoryRelationType(item.relation_type)}
      imageTopLabel={`Quantidade: ${renderNpcValue(item.quantity)}`}
      imageBottomLabel={
        shouldShowPrice ? formatNpcCurrency(item.item.cost) : undefined
      }
    />
  );
}

function EquipmentCard({ item }: { item: NpcEquipmentItem }) {
  return (
    <NpcItemCard
      item={item.item}
      headerLabel={formatEquipmentSlot(item.slot)}
    />
  );
}

function NpcItemCard({
  item,
  headerLabel,
  imageTopLabel,
  imageBottomLabel,
}: {
  item: NpcItem;
  headerLabel: string;
  imageTopLabel?: string;
  imageBottomLabel?: string;
}) {
  const imageSrc = getItemImageSrc(item.img_key);
  const details = getNpcItemCompactDetails(item);

  return (
    <article style={styles.itemCard}>
      <div style={styles.itemImageColumn}>
        {imageTopLabel ? (
          <div style={styles.itemImageTopLabel}>{imageTopLabel}</div>
        ) : null}

        <div style={styles.itemImageFrame}>
          <img src={imageSrc} alt={item.name} style={styles.itemImage} />
        </div>

        {imageBottomLabel ? (
          <div style={styles.itemImageBottomLabel}>{imageBottomLabel}</div>
        ) : null}
      </div>

      <div style={styles.itemContent}>
        <div style={styles.itemTopLine}>
          <strong style={styles.itemTitle}>{item.name}</strong>

          <span style={styles.itemTypeBadge}>
            {formatNpcItemType(item.item_type)}
          </span>
        </div>

        <div style={styles.itemSubLine}>
          <span>{headerLabel}</span>
        </div>

        {details.length > 0 ? (
          <div style={styles.itemDetailsLine}>
            {details.map((detail, index) => (
              <span
                key={`${detail.label}-${index}`}
                style={styles.itemDetailText}
              >
                {detail.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function getNpcItemCompactDetails(item: NpcItem): Array<{
  label: string;
  value: string;
}> {
  if (item.item_type === "arma") {
    return [
      {
        label: "Categoria",
        value: formatNpcItemValue(item.weapon_category),
      },
      {
        label: "Precisão",
        value: formatNpcItemValue(item.accuracy),
      },
      {
        label: "Dano",
        value: formatNpcItemValue(item.damage),
      },
      {
        label: "Tipo",
        value: formatDamageType(item.damage_type),
      },
      {
        label: "Empunhadura",
        value: formatWeaponGrip(item.grip),
      },
      {
        label: "Alcance",
        value: formatWeaponDistance(item.distance),
      },
      {
        label: "Uso",
        value: formatMartialValue(item.is_martial),
      },
    ].filter((detail) => detail.value !== "???");
  }

  if (item.item_type === "armadura" || item.item_type === "escudo") {
    return [
      {
        label: "Defesa",
        value: `DEF ${formatItemDefenseValue(
          item.defense_dice,
          item.defense_bonus,
        )}`,
      },
      {
        label: "Def. Mágica",
        value: `DM ${formatItemDefenseValue(
          item.magic_defense_dice,
          item.magic_defense_bonus,
        )}`,
      },
      {
        label: "Iniciativa",
        value: item.initiative ? `INI ${item.initiative}` : "???",
      },
      {
        label: "Uso",
        value: formatMartialValue(item.is_martial),
      },
    ].filter((detail) => !detail.value.includes("???"));
  }

  return [];
}

function SectionTitle({ children }: { children: string }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  backButton: {
    alignSelf: "flex-start",
    border: "1px solid #4c3922",
    borderRadius: "8px",
    background: "#15110f",
    color: "#c9963a",
    padding: "9px 12px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
  },

  heroCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "12px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    minHeight: "420px",
  },

  imageFrame: {
    minHeight: "420px",
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
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

  heroContent: {
    display: "grid",
    gridTemplateRows: "1fr 1fr",
    minHeight: "420px",
  },

  heroInfoBlock: {
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    borderBottom: "1px solid #3a2e22",
  },

  heroStatsBlock: {
    padding: "22px 26px",
    display: "flex",
    alignItems: "center",
  },

  title: {
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

  stats: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  statRowFour: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "10px",
  },

  statRowThree: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
  },

  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },

  statLabel: {
    color: "#7a6e5a",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  statValue: {
    color: "#f5efe2",
    fontSize: "18px",
    fontWeight: 900,
    lineHeight: 1,
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  sectionTitle: {
    margin: 0,
    color: "#e8c875",
    fontFamily: `"Cinzel", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textShadow: "0 0 18px rgba(201, 150, 58, 0.25)",
  },

  ruleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  ruleCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  typeBadge: {
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    background: "#1e1a16",
    color: "#c9963a",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  cardTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "20px",
    lineHeight: 1.15,
  },

  cardDescription: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },

  metadataList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "auto",
  },

  metadataBadge: {
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: 700,
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
  },

  itemCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "9px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "72px minmax(0, 1fr)",
    minHeight: "104px",
  },

  itemImageColumn: {
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    alignItems: "center",
    justifyItems: "center",
    padding: "6px",
    gap: "4px",
  },

  itemImageFrame: {
    width: "100%",
    minHeight: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  itemImageTopLabel: {
    color: "#9f8f73",
    fontSize: "10px",
    fontWeight: 800,
    lineHeight: 1.15,
    textAlign: "center",
  },

  itemImageBottomLabel: {
    color: "#c9963a",
    fontSize: "10px",
    fontWeight: 900,
    lineHeight: 1.15,
    textAlign: "center",
  },

  itemImage: {
    width: "100%",
    height: "100%",
    maxHeight: "48px",
    objectFit: "contain",
    display: "block",
  },

  itemContent: {
    padding: "9px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  itemTopLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    minWidth: 0,
  },

  itemTitle: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 800,
    lineHeight: 1.15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  itemTypeBadge: {
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#c9963a",
    padding: "2px 7px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  itemSubLine: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#9f8f73",
    fontSize: "11px",
    fontWeight: 700,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  separator: {
    color: "#5f574c",
  },

  itemCost: {
    color: "#7a6e5a",
    fontSize: "11px",
    fontWeight: 700,
  },

  itemDetailsLine: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px 8px",
    color: "#d4c9b0",
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: 1.25,
  },

  itemDetailText: {
    display: "inline-flex",
    alignItems: "center",
  },

  itemMeta: {
    color: "#7a6e5a",
    fontSize: "11px",
    fontWeight: 700,
  },

};