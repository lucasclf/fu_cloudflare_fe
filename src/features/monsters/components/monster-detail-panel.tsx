import { getMonsterImageSrc } from "../lib/get-monster-image-src";
import panelStyles from "./monster-detail-panel.module.css";
import {
  formatActionIcon,
  formatActionType,
  formatAffinityType,
  formatAffinityValue,
  formatMonsterType,
  hasMonsterDetailValue,
  isMonsterActionOffensive,
  isMonsterVillain,
  renderMonsterValue,
} from "../lib/monster-formatters";
import type {
  MonsterAction,
  MonsterAffinity,
  MonsterDetail,
} from "../types/monster";

const AFFINITY_KEYS: Array<keyof Omit<MonsterAffinity, "monster_id">> = [
  "physical",
  "air",
  "bolt",
  "dark",
  "earth",
  "fire",
  "ice",
  "light",
  "poison",
];

const ACTION_GROUPS = [
  {
    type: "basic_attack",
    title: "Ataques Básicos",
  },
  {
    type: "spell",
    title: "Feitiços",
  },
  {
    type: "other_action",
    title: "Outras Ações",
  },
  {
    type: "special_rule",
    title: "Regras Especiais",
  },
] as const;

type Props = {
  monster: MonsterDetail;
  onBackToList: () => void;
  onEdit?: () => void;
};

export function MonsterDetailPanel({ monster, onBackToList, onEdit }: Props) {
  const imageSrc = getMonsterImageSrc(monster.img_key);
  const affinity = monster.affinities[0];

  return (
    <div className={panelStyles.wrapper}>
      <div className={panelStyles.topActions}>
        <button type="button" onClick={onBackToList} className={panelStyles.backButton}>
          ← Voltar para o bestiário
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
              alt={monster.name}
              className={panelStyles.image}
            />
          ) : (
            <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
          )}
        </div>

        <div className={panelStyles.heroContent}>
          <div className={panelStyles.heroInfoBlock}>
            <div className={panelStyles.badges}>
              {isMonsterVillain(monster.is_villain) ? (
                <span className={panelStyles.villainBadge}>Vilão</span>
              ) : null}

              <span className={panelStyles.typeBadge}>
                {formatMonsterType(monster.monster_type)}
              </span>

              <span className={panelStyles.levelBadge}>Nível {monster.level}</span>
            </div>

            <h2 className={panelStyles.title}>{monster.name}</h2>

            <p className={panelStyles.description}>
              {renderMonsterValue(monster.description)}
            </p>

            {isMonsterVillain(monster.is_villain) ? (
              <VillainInfo monster={monster} />
            ) : null}

            <div className={panelStyles.traits}>
              {monster.traits.map((trait) => (
                <span key={trait.trait} className={panelStyles.traitBadge}>
                  {trait.trait}
                </span>
              ))}
            </div>
          </div>

          <div className={panelStyles.heroStatsBlock}>
            <CompactStats monster={monster} />
          </div>
        </div>
      </article>

      <section className={panelStyles.section}>
        <SectionTitle>Afinidades</SectionTitle>

        {affinity ? (
          <div className={panelStyles.affinityGrid}>
            {AFFINITY_KEYS.map((key) => (
              <div key={key} className={panelStyles.affinityItem}>
                <span className={panelStyles.affinityLabel}>
                  {formatAffinityType(key)}
                </span>
                <span className={panelStyles.affinityValue}>
                  {formatAffinityValue(affinity[key])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={panelStyles.empty}>Nenhuma afinidade cadastrada.</div>
        )}
      </section>

      <section className={panelStyles.section}>
        <SectionTitle>Ações</SectionTitle>

        {monster.actions.length > 0 ? (
          <div className={panelStyles.actionGroups}>
            {ACTION_GROUPS.map((group) => {
              const actions = monster.actions.filter(
                (action) => action.action_type === group.type,
              );

              if (actions.length === 0) {
                return null;
              }

              return (
                <div key={group.type} className={panelStyles.actionGroup}>
                  <h3 className={panelStyles.actionGroupTitle}>{group.title}</h3>

                  <div className={panelStyles.actionGrid}>
                    {actions.map((action) => (
                      <MonsterActionCard key={action.id} action={action} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={panelStyles.empty}>Nenhuma ação cadastrada.</div>
        )}
      </section>
    </div>
  );
}

function VillainInfo({ monster }: { monster: MonsterDetail }) {
  const showUltimaPoints = hasMonsterDetailValue(monster.ultima_points);
  const showStrategy = hasMonsterDetailValue(monster.strategy);

  if (!showUltimaPoints && !showStrategy) {
    return null;
  }

  return (
    <div className={panelStyles.villainInfo}>
      {showUltimaPoints ? (
        <div className={panelStyles.villainInfoItem}>
          <span className={panelStyles.villainInfoLabel}>Pontos Ultima</span>
          <span className={panelStyles.villainInfoValue}>{monster.ultima_points}</span>
        </div>
      ) : null}

      {showStrategy ? (
        <div className={panelStyles.villainStrategy}>
          <span className={panelStyles.villainInfoLabel}>Estratégia</span>
          <p className={panelStyles.villainStrategyText}>{monster.strategy}</p>
        </div>
      ) : null}
    </div>
  );
}

function MonsterActionCard({ action }: { action: MonsterAction }) {
  const offensive = isMonsterActionOffensive(action);
  const actionInfoItems = getActionInfoItems(action);

  return (
    <article className={panelStyles.actionCard}>
      <div className={panelStyles.badges}>
        <span
          className={[
            panelStyles.actionTypeBadge,
            offensive ? panelStyles.offensiveBadge : panelStyles.supportBadge,
          ].join(" ")}
        >
          {offensive ? "Ofensiva" : "Suporte"}
        </span>

        <span className={panelStyles.secondaryBadge}>
          {formatActionType(action.action_type)}
        </span>

        <span className={panelStyles.secondaryBadge}>
          {formatActionIcon(action.action_icon)}
        </span>
      </div>

      <h3 className={panelStyles.actionTitle}>{action.name}</h3>

      <p className={panelStyles.actionDescription}>{action.description}</p>

      {actionInfoItems.length > 0 ? (
        <div className={panelStyles.actionInfoGrid}>
          {actionInfoItems.map((item) => (
            <Info key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function hasActionInfoValue(
  value: string | number | null | undefined,
): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim().length > 0;
}

function getActionInfoItems(action: MonsterAction) {
  return [
    {
      label: "Teste",
      value: action.check_formula,
    },
    {
      label: "Precisão",
      value: action.accuracy_bonus,
    },
    {
      label: "Dano",
      value: action.damage_type ? formatAffinityType(action.damage_type) : action.damage_type,
    },
    {
      label: "Custo",
      value: action.cost,
    },
    {
      label: "Alvo",
      value: action.target,
    },
    {
      label: "Duração",
      value: action.duration,
    },
  ].filter((item) => hasActionInfoValue(item.value));
}

function CompactStats({ monster }: { monster: MonsterDetail }) {
  return (
    <div className={panelStyles.compactStats}>
      <div className={panelStyles.compactStatRowFour}>
        <CompactStat label="DES" value={monster.dexterity_die} />
        <CompactStat label="AST" value={monster.insight_die} />
        <CompactStat label="VIG" value={monster.might_die} />
        <CompactStat label="VON" value={monster.willpower_die} />
      </div>

      <div className={panelStyles.compactStatRowThree}>
        <CompactStat label="PV" value={monster.hp} />
        <CompactStat label="Crise" value={monster.crisis_hp} />
        <CompactStat label="PM" value={monster.mp} />
      </div>

      <div className={panelStyles.compactStatRowThree}>
        <CompactStat label="DEF" value={monster.defense} />
        <CompactStat label="DEF M." value={monster.magic_defense} />
        <CompactStat label="INI" value={monster.initiative} />
      </div>
    </div>
  );
}

function CompactStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className={panelStyles.compactStat}>
      <span className={panelStyles.compactStatLabel}>{label}</span>
      <span className={panelStyles.compactStatValue}>{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className={panelStyles.sectionTitle}>{children}</h2>;
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
      <span className={panelStyles.infoValue}>{renderMonsterValue(value)}</span>
    </div>
  );
}
