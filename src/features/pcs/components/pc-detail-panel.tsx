import { useState, type ReactNode } from "react";

import panelStyles from "./pc-detail-panel.module.css";
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
  onEdit?: () => void;
};

type CollapsibleSectionProps = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function PcDetailPanel({ pc, onBackToList, onEdit }: Props) {
  return (
    <div className={panelStyles.wrapper}>
      <button type="button" onClick={onBackToList} className={panelStyles.backButton}>
        ← Voltar para personagens
      </button>
      {onEdit && (
        <button type="button" onClick={onEdit} className={panelStyles.editButton}>
          ✏️ Editar
        </button>
      )}

      <article className={panelStyles.heroCard}>
        <div className={panelStyles.imageFrame}>
          {pc.img_key ? (
            <img src={pc.img_key} alt={pc.name} className={panelStyles.image} />
          ) : (
            <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
          )}
        </div>

        <div className={panelStyles.heroContent}>
          <div className={panelStyles.heroInfoBlock}>
            <div className={panelStyles.badges}>
              <span className={panelStyles.typeBadge}>Personagem</span>
              <span className={panelStyles.secondaryBadge}>Nível {pc.stats.level}</span>
              <span className={panelStyles.secondaryBadge}>
                {renderPcValue(pc.pronouns)}
              </span>
            </div>

            <h2 className={panelStyles.title}>{pc.name}</h2>
            <p className={panelStyles.tagline}>“{renderPcValue(pc.tagline)}”</p>
            <p className={panelStyles.description}>{renderPcValue(pc.description)}</p>

            <div className={panelStyles.identityGrid}>
              <Info label="Origem" value={pc.origin} />
              <Info label="Identidade" value={pc.identity} />
              <Info label="Tema" value={pc.theme} />
              <Info label="Zenit" value={pc.money} />
            </div>
          </div>

          <div className={panelStyles.heroStatsBlock}>
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
    <section className={panelStyles.collapsibleSection}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={panelStyles.collapsibleHeader}
      >
        <span className={panelStyles.collapsibleHeaderMain}>
          <span className={panelStyles.collapsibleChevron}>{open ? "▾" : "▸"}</span>
          <span className={panelStyles.collapsibleTitle}>{title}</span>

          {typeof count === "number" ? (
            <span className={panelStyles.collapsibleCount}>{count}</span>
          ) : null}
        </span>

        <span className={panelStyles.collapsibleAction}>
          {open ? "Fechar" : "Abrir"}
        </span>
      </button>

      {open ? <div className={panelStyles.collapsibleContent}>{children}</div> : null}
    </section>
  );
}

function PcStats({ pc }: { pc: PcDetail }) {
  return (
    <div className={panelStyles.stats}>
      <div className={panelStyles.statRowFour}>
        <Stat label="DES" value={pc.dexterity_die} />
        <Stat label="AST" value={pc.insight_die} />
        <Stat label="VIG" value={pc.might_die} />
        <Stat label="VON" value={pc.willpower_die} />
      </div>

      <div className={panelStyles.statRowThree}>
        <Stat label="PV" value={pc.stats.hp} />
        <Stat label="PM" value={pc.stats.mp} />
        <Stat label="PI" value={pc.stats.ip} />
      </div>

      <div className={panelStyles.statRowThree}>
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
    pc.pc_capacities.allows_martial_ranged_weapon
      ? "Armas à distância marciais"
      : null,
    pc.pc_capacities.allows_martial_melee_weapon
      ? "Armas corpo a corpo marciais"
      : null,
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
      <div className={panelStyles.badgeList}>
        {[...bonuses, ...capacities].map((capacity) => (
          <span key={capacity} className={panelStyles.secondaryBadge}>
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
      <div className={panelStyles.cardGridTwo}>
        {jobs.map((job) => (
          <article key={job.id} className={panelStyles.smallCard}>
            <div className={panelStyles.cardHeader}>
              <h3 className={panelStyles.cardTitle}>{job.name}</h3>
              <span className={panelStyles.secondaryBadge}>Nível {job.level}</span>
            </div>

            <p className={panelStyles.tagline}>{renderPcValue(job.tagline)}</p>
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
      <div className={panelStyles.list}>
        {powers.map((power) => (
          <article key={power.id} className={panelStyles.smallCard}>
            <div className={panelStyles.cardHeader}>
              <h3 className={panelStyles.cardTitle}>{power.name}</h3>

              <div className={panelStyles.badges}>
                <span className={panelStyles.secondaryBadge}>
                  {formatPowerType(power.type)}
                </span>
                <span className={panelStyles.secondaryBadge}>Nível {power.level}</span>
                <span className={panelStyles.secondaryBadge}>
                  Máx. {power.max_level}
                </span>
                {isTruthyFlag(power.is_global) ? (
                  <span className={panelStyles.secondaryBadge}>Global</span>
                ) : null}
              </div>
            </div>

            <p className={panelStyles.text}>{power.description}</p>
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
    <CollapsibleSection
      title="Magias"
      count={spells.length}
      defaultOpen={false}
    >
      <div className={panelStyles.cardGridTwo}>
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
    <CollapsibleSection
      title="Arcanas"
      count={arcanas.length}
      defaultOpen={false}
    >
      <div className={panelStyles.cardGridTwo}>
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
    <article className={panelStyles.smallCard}>
      <div className={panelStyles.cardHeader}>
        <h3 className={panelStyles.cardTitle}>{spell.name}</h3>

        <div className={panelStyles.badges}>
          <span className={panelStyles.secondaryBadge}>
            {isMonsterSpell(spell) ? "Monstro" : "Classe"}
          </span>

          {isTruthyFlag(spell.is_offensive) ? (
            <span className={panelStyles.offensiveBadge}>Ofensiva</span>
          ) : (
            <span className={panelStyles.secondaryBadge}>Suporte</span>
          )}

          {spell.cost ? (
            <span className={panelStyles.secondaryBadge}>{spell.cost}</span>
          ) : null}
        </div>
      </div>

      <div className={panelStyles.identityGrid}>
        <Info label="Alvo" value={spell.target} />
        <Info label="Duração" value={spell.duration} />
      </div>

      <p className={panelStyles.text}>{spell.description}</p>
    </article>
  );
}

function EquipmentSection({ pc }: { pc: PcDetail }) {
  if (!pc.equipment) return null;
  const equipment = [
    { slot: "main_hand", item: pc.equipment.main_hand },
    { slot: "off_hand", item: pc.equipment.off_hand },
    { slot: "armor", item: pc.equipment.armor },
    { slot: "accessory", item: pc.equipment.accessory },
  ].filter(
    (entry): entry is { slot: string; item: PcItem } => entry.item !== null,
  );

  if (equipment.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="Equipamentos" count={equipment.length}>
      <div className={panelStyles.cardGridTwo}>
        {equipment.map(({ slot, item }) => (
          <ItemCard
            key={`${slot}-${item.id}`}
            item={item}
            headerLabel={formatSlot(slot)}
          />
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
    <CollapsibleSection
      title="Inventário"
      count={inventories.length}
      defaultOpen={false}
    >
      <div className={panelStyles.cardGridTwo}>
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
    <article className={panelStyles.itemCard}>
      <div className={panelStyles.itemImageFrame}>
        <img
          src={getItemImageSrc(item.img_key)}
          alt={item.name}
          className={panelStyles.itemImage}
          loading="lazy"
        />
      </div>

      <div className={panelStyles.itemContent}>
        <div className={panelStyles.cardHeader}>
          <h3 className={panelStyles.cardTitle}>{item.name}</h3>

          <div className={panelStyles.badges}>
            <span className={panelStyles.secondaryBadge}>
              {formatItemType(item.item_type)}
            </span>
            <span className={panelStyles.secondaryBadge}>{headerLabel}</span>
          </div>
        </div>

        {details.length > 0 ? (
          <div className={panelStyles.itemDetailsLine}>
            {details.map((detail) => (
              <span key={detail} className={panelStyles.itemDetailText}>
                {detail}
              </span>
            ))}
          </div>
        ) : null}

        {item.description ? (
          <p className={panelStyles.text}>{item.description}</p>
        ) : null}
      </div>
    </article>
  );
}

function BondsSection({ bonds }: { bonds: PcBond[] }) {
  if (bonds.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection
      title="Vínculos"
      count={bonds.length}
      defaultOpen={false}
    >
      <div className={panelStyles.cardGridTwo}>
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
              className={panelStyles.bondCard}
            >
              <div className={panelStyles.bondImageFrame}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={targetTitle}
                    className={panelStyles.bondImage}
                    loading="lazy"
                  />
                ) : (
                  <span className={panelStyles.bondImagePlaceholder}>Sem imagem</span>
                )}
              </div>

              <div className={panelStyles.bondContent}>
                <div className={panelStyles.cardHeader}>
                  <h3 className={panelStyles.cardTitle}>{targetTitle}</h3>

                  <span className={panelStyles.secondaryBadge}>
                    {formatTargetType(bond.target_type)}
                  </span>
                </div>

                {axes.length > 0 ? (
                  <div className={panelStyles.badgeList}>
                    {axes.map((axis) => (
                      <span key={axis} className={panelStyles.secondaryBadge}>
                        {axis}
                      </span>
                    ))}
                  </div>
                ) : null}

                {bond.description ? (
                  <p className={panelStyles.text}>{bond.description}</p>
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

    const defense = formatItemDefenseValue(
      item.defense_dice,
      item.defense_bonus,
    );
    const magicDefense = formatItemDefenseValue(
      item.magic_defense_dice,
      item.magic_defense_bonus,
    );

    if (defense !== "???") details.push(`DEF ${defense}`);
    if (magicDefense !== "???") details.push(`DM ${magicDefense}`);
  }

  if (item.item_type === "armadura" || item.item_type === "escudo") {
    const defense = formatItemDefenseValue(
      item.defense_dice,
      item.defense_bonus,
    );
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
    <div className={panelStyles.info}>
      <span className={panelStyles.infoLabel}>{label}</span>
      <span className={panelStyles.infoValue}>{renderPcValue(value)}</span>
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
    <div className={panelStyles.stat}>
      <span className={panelStyles.statLabel}>{label}</span>
      <span className={panelStyles.statValue}>{renderPcValue(value)}</span>
    </div>
  );
}
