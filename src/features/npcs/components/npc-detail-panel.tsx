import { getNpcImageSrc } from "../lib/get-npc-image-src";
import panelStyles from "./npc-detail-panel.module.css";
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
  NpcEquipment,
  NpcInventoryItem,
  NpcItem,
  NpcSpecialRule,
} from "../types/npc";
import { getItemImageSrc } from "../../items/lib/get-item-image-src";
import { formatItemDefenseValue } from "../../items/lib/item-formatters.ts";

type Props = {
  npc: NpcDetail;
  onBackToList: () => void;
  onEdit?: () => void;
};

export function NpcDetailPanel({ npc, onBackToList, onEdit }: Props) {
  const imageSrc = getNpcImageSrc(npc.img_key);

  return (
    <div className={panelStyles.wrapper}>
      <div className={panelStyles.headerActions}>
        <button type="button" onClick={onBackToList} className={panelStyles.backButton}>
          ← Voltar para NPCs
        </button>
        {onEdit ? (
          <button type="button" onClick={onEdit} className={panelStyles.editButton}>
            ✏️ Editar
          </button>
        ) : null}
      </div>

      <article className={panelStyles.heroCard}>
        <div className={panelStyles.imageFrame}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={npc.name}
              className={panelStyles.image}
            />
          ) : (
            <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
          )}
        </div>

        <div className={panelStyles.heroContent}>
          <div className={panelStyles.heroInfoBlock}>
            <h2 className={panelStyles.title}>{npc.name}</h2>

            <p className={panelStyles.tagline}>“{renderNpcValue(npc.tagline)}”</p>

            <p className={panelStyles.description}>{renderNpcValue(npc.description)}</p>
          </div>

          <div className={panelStyles.heroStatsBlock}>
            <NpcStats npc={npc} />
          </div>
        </div>
      </article>

      {npc.specialRules.length > 0 ? (
        <section className={panelStyles.section}>
          <SectionTitle>Regras Especiais</SectionTitle>

          <div className={panelStyles.ruleGrid}>
            {npc.specialRules.map((rule) => (
              <SpecialRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </section>
      ) : null}

      {npc.inventory.length > 0 ? (
        <section className={panelStyles.section}>
          <SectionTitle>Inventário</SectionTitle>

          <div className={panelStyles.itemGrid}>
            {npc.inventory.map((item) => (
              <InventoryCard
                key={`${item.item.id}-${item.relation_type}`}
                item={item}
              />
            ))}
          </div>
        </section>
      ) : null}

      {npc.equipment ? (
        <EquipmentSection equipment={npc.equipment} />
      ) : null}
    </div>
  );
}

function NpcStats({ npc }: { npc: NpcDetail }) {
  return (
    <div className={panelStyles.stats}>
      <div className={panelStyles.statRowFour}>
        <Stat label="DES" value={npc.dexterity_die} />
        <Stat label="AST" value={npc.insight_die} />
        <Stat label="VIG" value={npc.might_die} />
        <Stat label="VON" value={npc.willpower_die} />
      </div>

      <div className={panelStyles.statRowThree}>
        <Stat label="PV" value={npc.hp} />
        <Stat label="PM" value={npc.mp} />
        <Stat label="Nível" value={npc.level} />
      </div>

      <div className={panelStyles.statRowThree}>
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
    <div className={panelStyles.stat}>
      <span className={panelStyles.statLabel}>{label}</span>
      <span className={panelStyles.statValue}>{renderNpcValue(value)}</span>
    </div>
  );
}

function SpecialRuleCard({ rule }: { rule: NpcSpecialRule }) {
  const metadataEntries = rule.metadata ? Object.entries(rule.metadata) : [];

  return (
    <article className={panelStyles.ruleCard}>
      <div className={panelStyles.badges}>
        <span className={panelStyles.typeBadge}>{formatSpecialRuleType(rule.type)}</span>
      </div>

      <h3 className={panelStyles.cardTitle}>{rule.title}</h3>

      <p className={panelStyles.cardDescription}>{rule.description}</p>

      {metadataEntries.length > 0 ? (
        <div className={panelStyles.metadataList}>
          {metadataEntries.map(([key, value]) => (
            <span key={key} className={panelStyles.metadataBadge}>
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

function EquipmentSection({ equipment }: { equipment: NpcEquipment }) {
  const slots = (
    [
      ["main_hand", equipment.main_hand],
      ["off_hand", equipment.off_hand],
      ["armor", equipment.armor],
      ["accessory", equipment.accessory],
    ] as const
  ).filter(
    (entry): entry is [typeof entry[0], NpcItem] => entry[1] !== null,
  );

  if (slots.length === 0) return null;

  return (
    <section className={panelStyles.section}>
      <SectionTitle>Equipamentos</SectionTitle>

      <div className={panelStyles.itemGrid}>
        {slots.map(([slot, item]) => (
          <NpcItemCard
            key={slot}
            item={item}
            headerLabel={formatEquipmentSlot(slot)}
          />
        ))}
      </div>
    </section>
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
    <article className={panelStyles.itemCard}>
      <div className={panelStyles.itemImageColumn}>
        {imageTopLabel ? (
          <div className={panelStyles.itemImageTopLabel}>{imageTopLabel}</div>
        ) : null}

        <div className={panelStyles.itemImageFrame}>
          <img src={imageSrc} alt={item.name} className={panelStyles.itemImage} loading="lazy" />
        </div>

        {imageBottomLabel ? (
          <div className={panelStyles.itemImageBottomLabel}>{imageBottomLabel}</div>
        ) : null}
      </div>

      <div className={panelStyles.itemContent}>
        <div className={panelStyles.itemTopLine}>
          <strong className={panelStyles.itemTitle}>{item.name}</strong>

          <span className={panelStyles.itemTypeBadge}>
            {formatNpcItemType(item.item_type)}
          </span>
        </div>

        <div className={panelStyles.itemSubLine}>
          <span>{headerLabel}</span>
        </div>

        {details.length > 0 ? (
          <div className={panelStyles.itemDetailsLine}>
            {details.map((detail, index) => (
              <span
                key={`${detail.label}-${index}`}
                className={panelStyles.itemDetailText}
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
  return <h2 className={panelStyles.sectionTitle}>{children}</h2>;
}
