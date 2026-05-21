import { useState, type CSSProperties, type ReactNode } from "react";

import { getPcImageSrc } from "../lib/get-pc-image-src";
import {
  formatBondAxis,
  formatDamageType,
  formatItemType,
  formatPowerType,
  formatSlot,
  formatTargetType,
  isTruthyFlag,
  renderPcValue,
} from "../lib/pc-formatters";
import type {
  PcArcana,
  PcBond,
  PcDetail,
  PcInventoryItem,
  PcItem,
  PcJob,
  PcPower,
  PcSpell,
} from "../types/pc";
import { getItemImageSrc } from "../../items/lib/get-item-image-src";
import { formatItemDefenseValue } from "../../items/lib/item-formatters.ts";
import { getPcBondImageSrc } from "../lib/get-pc-bond-image-src.ts";

type Props = {
  pc: PcDetail;
  onBackToList: () => void;
};

type CollapsibleSectionProps = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function PcDetailPanel({ pc, onBackToList }: Props) {
  return (
    <div style={styles.wrapper}>
      <button type="button" onClick={onBackToList} style={styles.backButton}>
        ← Voltar para personagens
      </button>

      <article style={styles.heroCard}>
        <div style={styles.imageFrame}>
          <img src={getPcImageSrc(pc.img_key)} alt={pc.name} style={styles.image} />
        </div>

        <div style={styles.heroContent}>
          <div style={styles.heroInfoBlock}>
            <div style={styles.badges}>
              <span style={styles.typeBadge}>Personagem</span>
              <span style={styles.secondaryBadge}>Nível {pc.stats.level}</span>
              <span style={styles.secondaryBadge}>{renderPcValue(pc.pronouns)}</span>
            </div>

            <h2 style={styles.title}>{pc.name}</h2>
            <p style={styles.tagline}>“{renderPcValue(pc.tagline)}”</p>
            <p style={styles.description}>{renderPcValue(pc.description)}</p>

            <div style={styles.identityGrid}>
              <Info label="Origem" value={pc.origin} />
              <Info label="Identidade" value={pc.identity} />
              <Info label="Tema" value={pc.theme} />
              <Info label="Zenit" value={pc.money} />
            </div>
          </div>

          <div style={styles.heroStatsBlock}>
            <PcStats pc={pc} />
          </div>
        </div>
      </article>

      <CapacitiesSection pc={pc} />
      <JobsSection jobs={pc.jobs} />
      <PowersSection powers={pc.powers} />
      <SpellsSection spells={[...pc.spells, ...pc.monsterSpells]} />
      <ArcanasSection arcanas={pc.arcanas} />
      <EquipmentSection pc={pc} />
      <InventorySection inventories={pc.inventories} />
      <BondsSection bonds={pc.bonds} />
    </div>
  );
}

function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section style={styles.collapsibleSection}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={styles.collapsibleHeader}
      >
        <span style={styles.collapsibleHeaderMain}>
          <span style={styles.collapsibleChevron}>{open ? "▾" : "▸"}</span>
          <span style={styles.collapsibleTitle}>{title}</span>

          {typeof count === "number" ? (
            <span style={styles.collapsibleCount}>{count}</span>
          ) : null}
        </span>

        <span style={styles.collapsibleAction}>{open ? "Fechar" : "Abrir"}</span>
      </button>

      {open ? <div style={styles.collapsibleContent}>{children}</div> : null}
    </section>
  );
}

function PcStats({ pc }: { pc: PcDetail }) {
  return (
    <div style={styles.stats}>
      <div style={styles.statRowFour}>
        <Stat label="DES" value={pc.dexterity_die} />
        <Stat label="AST" value={pc.insight_die} />
        <Stat label="VIG" value={pc.might_die} />
        <Stat label="VON" value={pc.willpower_die} />
      </div>

      <div style={styles.statRowThree}>
        <Stat label="PV" value={pc.stats.hp} />
        <Stat label="PM" value={pc.stats.mp} />
        <Stat label="PI" value={pc.stats.ip} />
      </div>

      <div style={styles.statRowThree}>
        <Stat label="DEF" value={pc.stats.defense} />
        <Stat label="DEF M." value={pc.stats.magic_defense} />
        <Stat label="INI" value={pc.stats.initiative} />
      </div>
    </div>
  );
}

function CapacitiesSection({ pc }: { pc: PcDetail }) {
  const capacities = [
    pc.pc_capacities.allows_martial_armor ? "Armaduras marciais" : null,
    pc.pc_capacities.allows_martial_shield ? "Escudos marciais" : null,
    pc.pc_capacities.allows_martial_ranged_weapon ? "Armas à distância marciais" : null,
    pc.pc_capacities.allows_martial_melee_weapon ? "Armas corpo a corpo marciais" : null,
    pc.pc_capacities.allows_arcane ? "Arcanas" : null,
    pc.pc_capacities.allows_rituals ? "Rituais" : null,
    pc.pc_capacities.allows_monster_spells ? "Magias de monstro" : null,
    pc.pc_capacities.can_start_projects ? "Projetos" : null,
  ].filter((item): item is string => item !== null);

  const bonuses = [
    pc.pc_capacities.hp_bonus > 0 ? `+${pc.pc_capacities.hp_bonus} PV` : null,
    pc.pc_capacities.mp_bonus > 0 ? `+${pc.pc_capacities.mp_bonus} PM` : null,
    pc.pc_capacities.ip_bonus > 0 ? `+${pc.pc_capacities.ip_bonus} PI` : null,
  ].filter((item): item is string => item !== null);

  if (capacities.length === 0 && bonuses.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection
      title="Capacidades"
      count={capacities.length + bonuses.length}
      defaultOpen={false}
    >
      <div style={styles.badgeList}>
        {[...bonuses, ...capacities].map((capacity) => (
          <span key={capacity} style={styles.secondaryBadge}>
            {capacity}
          </span>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function JobsSection({ jobs }: { jobs: PcJob[] }) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Classes" count={jobs.length}>
      <div style={styles.cardGridTwo}>
        {jobs.map((job) => (
          <article key={job.id} style={styles.smallCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{job.name}</h3>
              <span style={styles.secondaryBadge}>Nível {job.level}</span>
            </div>

            <p style={styles.tagline}>{renderPcValue(job.tagline)}</p>
          </article>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function PowersSection({ powers }: { powers: PcPower[] }) {
  if (powers.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Poderes" count={powers.length}>
      <div style={styles.list}>
        {powers.map((power) => (
          <article key={power.id} style={styles.smallCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{power.name}</h3>

              <div style={styles.badges}>
                <span style={styles.secondaryBadge}>{formatPowerType(power.type)}</span>
                <span style={styles.secondaryBadge}>Nível {power.level}</span>
                <span style={styles.secondaryBadge}>Máx. {power.max_level}</span>
                {isTruthyFlag(power.is_global) ? (
                  <span style={styles.secondaryBadge}>Global</span>
                ) : null}
              </div>
            </div>

            <p style={styles.text}>{power.description}</p>
          </article>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function SpellsSection({ spells }: { spells: PcSpell[] }) {
  if (spells.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Magias" count={spells.length} defaultOpen={false}>
      <div style={styles.cardGridTwo}>
        {spells.map((spell) => (
          <SpellCard key={getPcSpellKey(spell)} spell={spell} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function getPcSpellKey(spell: PcSpell): string {
  if (spell.nature === "monster" || spell.monster_id !== undefined) {
    return `monster-spell-${spell.monster_id ?? "unknown"}-${spell.id}`;
  }

  return `job-spell-${spell.job_id ?? "unknown"}-${spell.id}`;
}

function ArcanasSection({ arcanas }: { arcanas: PcArcana[] }) {
  if (arcanas.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Arcanas" count={arcanas.length} defaultOpen={false}>
      <div style={styles.cardGridTwo}>
        {arcanas.map((arcana) => (
          <SpellCard key={`arcana-${arcana.id}`} spell={arcana} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function isMonsterSpell(spell: PcSpell): boolean {
  return spell.nature === "monster" || spell.monster_id !== undefined;
}

function SpellCard({ spell }: { spell: PcSpell | PcArcana }) {
  return (
    <article style={styles.smallCard}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{spell.name}</h3>

        <div style={styles.badges}>
          <span style={styles.secondaryBadge}>
            {isMonsterSpell(spell) ? "Monstro" : "Classe"}
          </span>

          {isTruthyFlag(spell.is_offensive) ? (
            <span style={styles.offensiveBadge}>Ofensiva</span>
          ) : (
            <span style={styles.secondaryBadge}>Suporte</span>
          )}

          {spell.cost ? <span style={styles.secondaryBadge}>{spell.cost}</span> : null}
        </div>
      </div>

      <div style={styles.identityGrid}>
        <Info label="Alvo" value={spell.target} />
        <Info label="Duração" value={spell.duration} />
      </div>

      <p style={styles.text}>{spell.description}</p>
    </article>
  );
}

function EquipmentSection({ pc }: { pc: PcDetail }) {
  const equipment = [
    { slot: "main_hand", item: pc.equipment.main_hand },
    { slot: "off_hand", item: pc.equipment.off_hand },
    { slot: "armor", item: pc.equipment.armor },
    { slot: "accessory", item: pc.equipment.accessory },
  ].filter((entry): entry is { slot: string; item: PcItem } => entry.item !== null);

  if (equipment.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Equipamentos" count={equipment.length}>
      <div style={styles.cardGridTwo}>
        {equipment.map(({ slot, item }) => (
          <ItemCard key={`${slot}-${item.id}`} item={item} headerLabel={formatSlot(slot)} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function InventorySection({ inventories }: { inventories: PcInventoryItem[] }) {
  if (inventories.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Inventário" count={inventories.length} defaultOpen={false}>
      <div style={styles.cardGridTwo}>
        {inventories.map((entry) => (
          <ItemCard
            key={`${entry.item.id}-${entry.quantity}`}
            item={entry.item}
            headerLabel={`Quantidade: ${renderPcValue(entry.quantity)}`}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function ItemCard({
  item,
  headerLabel,
}: {
  item: PcItem;
  headerLabel: string;
}) {
  const details = getItemDetails(item);

  return (
    <article style={styles.itemCard}>
      <div style={styles.itemImageFrame}>
        <img src={getItemImageSrc(item.img_key)} alt={item.name} style={styles.itemImage} />
      </div>

      <div style={styles.itemContent}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{item.name}</h3>

          <div style={styles.badges}>
            <span style={styles.secondaryBadge}>{formatItemType(item.item_type)}</span>
            <span style={styles.secondaryBadge}>{headerLabel}</span>
          </div>
        </div>

        {details.length > 0 ? (
          <div style={styles.itemDetailsLine}>
            {details.map((detail) => (
              <span key={detail} style={styles.itemDetailText}>
                {detail}
              </span>
            ))}
          </div>
        ) : null}

        {item.description ? <p style={styles.text}>{item.description}</p> : null}
      </div>
    </article>
  );
}

function BondsSection({ bonds }: { bonds: PcBond[] }) {
  if (bonds.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Vínculos" count={bonds.length} defaultOpen={false}>
      <div style={styles.cardGridTwo}>
        {bonds.map((bond, index) => {
          const axes = [
            formatBondAxis(bond.admiration_axis),
            formatBondAxis(bond.loyalty_axis),
            formatBondAxis(bond.affection_axis),
          ].filter((axis): axis is string => axis !== null);

          const imageSrc = getPcBondImageSrc(bond.target_type, bond.img_key);

          const targetTitle =
            bond.target_name ??
            `${formatTargetType(bond.target_type)} #${renderPcValue(
              bond.target_id,
            )}`;

          return (
            <article
              key={`${bond.target_type}-${bond.target_id}-${index}`}
              style={styles.bondCard}
            >
              <div style={styles.bondImageFrame}>
                {imageSrc ? (
                  <img src={imageSrc} alt={targetTitle} style={styles.bondImage} />
                ) : (
                  <span style={styles.bondImagePlaceholder}>Sem imagem</span>
                )}
              </div>

              <div style={styles.bondContent}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{targetTitle}</h3>

                  <span style={styles.secondaryBadge}>
                    {formatTargetType(bond.target_type)}
                  </span>
                </div>

                {axes.length > 0 ? (
                  <div style={styles.badgeList}>
                    {axes.map((axis) => (
                      <span key={axis} style={styles.secondaryBadge}>
                        {axis}
                      </span>
                    ))}
                  </div>
                ) : null}

                {bond.description ? (
                  <p style={styles.text}>{bond.description}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}

function getItemDetails(item: PcItem): string[] {
  const details: string[] = [];

  if (item.item_type === "arma") {
    pushIf(details, item.weapon_category);
    pushIf(details, item.accuracy);
    pushIf(details, item.damage);
    pushIf(details, formatDamageType(item.damage_type));

    const defense = formatItemDefenseValue(item.defense_dice, item.defense_bonus);
    const magicDefense = formatItemDefenseValue(
      item.magic_defense_dice,
      item.magic_defense_bonus,
    );

    if (defense !== "???") details.push(`DEF ${defense}`);
    if (magicDefense !== "???") details.push(`DM ${magicDefense}`);
  }

  if (item.item_type === "armadura" || item.item_type === "escudo") {
    const defense = formatItemDefenseValue(item.defense_dice, item.defense_bonus);
    const magicDefense = formatItemDefenseValue(
      item.magic_defense_dice,
      item.magic_defense_bonus,
    );

    if (defense !== "???") details.push(`DEF ${defense}`);
    if (magicDefense !== "???") details.push(`DM ${magicDefense}`);
    pushIf(details, item.initiative ? `INI ${item.initiative}` : null);
  }

  return details;
}

function pushIf(target: string[], value: string | null | undefined) {
  if (value && value.trim().length > 0 && value !== "???") {
    target.push(value);
  }
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div style={styles.info}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{renderPcValue(value)}</span>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{renderPcValue(value)}</span>
    </div>
  );
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    padding: "16px",
    boxSizing: "border-box",
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
    fontSize: "14px",
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

  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  badgeList: {
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

  secondaryBadge: {
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  offensiveBadge: {
    border: "1px solid #8a372e",
    borderRadius: "999px",
    background: "#251311",
    color: "#e68b7d",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  identityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
  },

  info: {
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  infoLabel: {
    color: "#7a6e5a",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  infoValue: {
    color: "#f5efe2",
    fontSize: "12px",
    fontWeight: 800,
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

  collapsibleSection: {
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    background: "#120f0d",
    overflow: "hidden",
  },

  collapsibleHeader: {
    width: "100%",
    border: 0,
    borderBottom: "1px solid #3a2e22",
    background: "#1a1512",
    color: "#f5efe2",
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left",
  },

  collapsibleHeaderMain: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  collapsibleChevron: {
    color: "#c9963a",
    width: "16px",
    display: "inline-flex",
    justifyContent: "center",
  },

  collapsibleTitle: {
    color: "#e8c875",
    fontSize: "16px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  collapsibleCount: {
    border: "1px solid #4c3922",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 800,
  },

  collapsibleAction: {
    color: "#7a6e5a",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  collapsibleContent: {
    padding: "16px",
  },

  cardGridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  smallCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  cardTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "18px",
    lineHeight: 1.15,
  },

  text: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },

  itemCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "82px minmax(0, 1fr)",
    minHeight: "120px",
  },

  itemImageFrame: {
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },

  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },

  itemContent: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  itemDetailsLine: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px 9px",
    color: "#d4c9b0",
    fontSize: "12px",
    fontWeight: 700,
  },

  itemDetailText: {
    display: "inline-flex",
  },

  bondCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "96px minmax(0, 1fr)",
    minHeight: "128px",
  },

  bondImageFrame: {
    background: "#0e0c0a",
    borderRight: "1px solid #3a2e22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },

  bondImagePlaceholder: {
    color: "#5f574c",
    fontSize: "11px",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 1.2,
  },

  bondImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },

  bondContent: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};