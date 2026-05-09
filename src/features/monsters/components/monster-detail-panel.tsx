import type { CSSProperties } from "react";
import { getMonsterImageSrc } from "../lib/get-monster-image-src";
import {
  formatActionIcon,
  formatActionType,
  formatAffinityType,
  formatAffinityValue,
  formatMonsterType,
  isMonsterActionOffensive,
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
};

export function MonsterDetailPanel({ monster, onBackToList }: Props) {
  const imageSrc = getMonsterImageSrc(monster.img_key);
  const affinity = monster.affinities[0];

  return (
    <div style={styles.wrapper}>
      <button type="button" onClick={onBackToList} style={styles.backButton}>
        ← Voltar para o bestiário
      </button>

      <article style={styles.heroCard}>
        <div style={styles.imageFrame}>
          {imageSrc ? (
            <img src={imageSrc} alt={monster.name} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>Sem imagem</div>
          )}
        </div>

        <div style={styles.heroContent}>
            <div style={styles.heroInfoBlock}>
                <div style={styles.badges}>
                <span style={styles.typeBadge}>
                    {formatMonsterType(monster.monster_type)}
                </span>

                <span style={styles.levelBadge}>Nível {monster.level}</span>
                </div>

                <h2 style={styles.title}>{monster.name}</h2>

                <p style={styles.description}>
                {renderMonsterValue(monster.description)}
                </p>

                <div style={styles.traits}>
                {monster.traits.map((trait) => (
                    <span key={trait.trait} style={styles.traitBadge}>
                    {trait.trait}
                    </span>
                ))}
                </div>
            </div>

            <div style={styles.heroStatsBlock}>
                <CompactStats monster={monster} />
            </div>
        </div>
      </article>

      <section style={styles.section}>
        <SectionTitle>Afinidades</SectionTitle>

        {affinity ? (
          <div style={styles.affinityGrid}>
            {AFFINITY_KEYS.map((key) => (
              <div key={key} style={styles.affinityItem}>
                <span style={styles.affinityLabel}>
                  {formatAffinityType(key)}
                </span>
                <span style={styles.affinityValue}>
                  {formatAffinityValue(affinity[key])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>Nenhuma afinidade cadastrada.</div>
        )}
      </section>

      <section style={styles.section}>
        <SectionTitle>Ações</SectionTitle>

        {monster.actions.length > 0 ? (
            <div style={styles.actionGroups}>
            {ACTION_GROUPS.map((group) => {
                const actions = monster.actions.filter(
                (action) => action.action_type === group.type,
                );

                if (actions.length === 0) {
                return null;
                }

                return (
                <div key={group.type} style={styles.actionGroup}>
                    <h3 style={styles.actionGroupTitle}>{group.title}</h3>

                    <div style={styles.actionGrid}>
                    {actions.map((action) => (
                        <MonsterActionCard key={action.id} action={action} />
                    ))}
                    </div>
                </div>
                );
            })}
            </div>
        ) : (
            <div style={styles.empty}>Nenhuma ação cadastrada.</div>
        )}
        </section>
    </div>
  );
}

function MonsterActionCard({ action }: { action: MonsterAction }) {
  const offensive = isMonsterActionOffensive(action);
  const actionInfoItems = getActionInfoItems(action);

  return (
    <article style={styles.actionCard}>
      <div style={styles.badges}>
        <span
          style={{
            ...styles.actionTypeBadge,
            ...(offensive ? styles.offensiveBadge : styles.supportBadge),
          }}
        >
          {offensive ? "Ofensiva" : "Suporte"}
        </span>

        <span style={styles.secondaryBadge}>
          {formatActionType(action.action_type)}
        </span>

        <span style={styles.secondaryBadge}>
          {formatActionIcon(action.action_icon)}
        </span>
      </div>

      <h3 style={styles.actionTitle}>{action.name}</h3>

      <p style={styles.actionDescription}>{action.description}</p>

      {actionInfoItems.length > 0 ? (
        <div style={styles.actionInfoGrid}>
          {actionInfoItems.map((item) => (
            <Info
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function hasActionInfoValue(value: string | number | null | undefined): boolean {
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
      value: action.damage_type,
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
    <div style={styles.compactStats}>
      <div style={styles.compactStatRowFour}>
        <CompactStat label="DES" value={monster.dexterity_die} />
        <CompactStat label="AST" value={monster.insight_die} />
        <CompactStat label="VIG" value={monster.might_die} />
        <CompactStat label="VON" value={monster.willpower_die} />
      </div>

      <div style={styles.compactStatRowThree}>
        <CompactStat label="PV" value={monster.hp} />
        <CompactStat label="Crise" value={monster.crisis_hp} />
        <CompactStat label="PM" value={monster.mp} />
      </div>

      <div style={styles.compactStatRowThree}>
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
    <div style={styles.compactStat}>
      <span style={styles.compactStatLabel}>{label}</span>
      <span style={styles.compactStatValue}>{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
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
      <span style={styles.infoValue}>{renderMonsterValue(value)}</span>
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
    minHeight: "240px",
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

  levelBadge: {
    border: "1px solid #34291f",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#9f8f73",
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

  title: {
    margin: 0,
    color: "#e8c875",
    fontSize: "34px",
    lineHeight: 1.05,
  },

  description: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "15px",
    lineHeight: 1.65,
    whiteSpace: "pre-line",
  },

  traits: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "auto",
  },

  traitBadge: {
    border: "1px solid #516744",
    borderRadius: "999px",
    background: "#141f12",
    color: "#aad18f",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
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

  affinityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
  },

  affinityItem: {
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  affinityLabel: {
    color: "#7a6e5a",
    fontSize: "13px",
    fontWeight: 800,
  },

  affinityValue: {
    color: "#f5efe2",
    fontSize: "13px",
    fontWeight: 900,
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  actionCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  actionTypeBadge: {
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  offensiveBadge: {
    border: "1px solid #8a372e",
    background: "#251311",
    color: "#e68b7d",
  },

  supportBadge: {
    border: "1px solid #5a4630",
    background: "#241d18",
    color: "#d4c9b0",
  },

  actionTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "20px",
    lineHeight: 1.15,
  },

  actionDescription: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },

  actionInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "8px",
    marginTop: "auto",
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

  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },

compactStats: {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
},

compactStatRowFour: {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "10px",
},

compactStatRowThree: {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "10px",
},

compactStat: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  minWidth: 0,
},

compactStatLabel: {
  color: "#7a6e5a",
  fontSize: "11px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
},

compactStatValue: {
  color: "#f5efe2",
  fontSize: "18px",
  fontWeight: 900,
  lineHeight: 1,
},

actionGroups: {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
},

actionGroup: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
},

actionGroupTitle: {
  margin: 0,
  color: "#d7c7a8",
  fontFamily: `"Cinzel", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  fontSize: "19px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderBottom: "1px solid #3a2e22",
  paddingBottom: "8px",
},
};