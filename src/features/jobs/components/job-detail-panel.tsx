import { getJobImageSrc } from "../lib/get-job-image-src";
import {
  ALLOWANCE_DEFINITIONS,
  isJobAllowanceEnabled,
} from "./job-allowance-icons";
import {
  getAliasText,
  getQuestionText,
  renderOptionalValue,
  renderTokenLabel,
} from "../lib/job-formatters";
import type { Job, JobPower, JobSpell, JobArcana} from "../types/job";
import type { ReactNode } from "react";

type Props = {
  job: Job;
  loading: boolean;
  error: string | null;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

export function JobDetailPanel({ job, loading, error }: Props) {
  const imageSrc = getJobImageSrc(job.img_key);

  return (
    <div style={styles.wrapper}>
      <section style={styles.hero}>
        <div style={styles.heroMain}>
          <div style={styles.heroImageWrapper}>
            {imageSrc ? (
              <img src={imageSrc} alt={job.name} style={styles.heroImage} />
            ) : (
              <span style={styles.heroInitials}>{getInitials(job.name)}</span>
            )}
          </div>

          <div style={styles.heroText}>
            <div style={styles.badge}>Classe</div>
            <h2 style={styles.heroTitle}>{job.name}</h2>
            {job.tagline ? <p style={styles.tagline}>{job.tagline}</p> : null}
          </div>
        </div>

        <HeroAllowanceIcons job={job} />
      </section>

      {loading ? <div style={styles.message}>Carregando detalhes...</div> : null}
      {error ? <div style={styles.message}>{error}</div> : null}

      {!loading && !error ? (
        <>
          <BackgroundSection job={job} />
          <PowersSection powers={job.powers} />
          <ArcanasSection arcanas={job.arcanas} />
          <SpellsSection spells={job.spells} />
        </>
      ) : null}
    </div>
  );
}

type HeroAllowanceIconsProps = {
  job: Job;
};

type JobBonusKey = "hp_bonus" | "mp_bonus" | "ip_bonus";

type BonusDefinition = {
  key: JobBonusKey;
  label: string;
  icon: ReactNode;
};

function getPositiveBonus(value: unknown): number {
  const bonus = Number(value);
  return Number.isFinite(bonus) && bonus > 0 ? bonus : 0;
}

const BONUS_DEFINITIONS: BonusDefinition[] = [
  {
    key: "hp_bonus",
    label: "PV",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7-4.4-9.2-8.7C1.2 9.1 2.2 5.4 5.4 4.2 7.3 3.5 9.5 4 12 6.4c2.5-2.4 4.7-2.9 6.6-2.2 3.2 1.2 4.2 4.9 2.6 8.1C19 16.6 12 21 12 21Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    key: "mp_bonus",
    label: "PM",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5 13.7 8l5.4-1.7-2.8 5 4.9 2.8-5.6 1-1 5.6-3.6-4.4-4.8 3 1.2-5.6-5.5-1.5 5-2.8-2.2-5.2L10 7.1 12 2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    key: "ip_bonus",
    label: "PI",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 6.5V5.8C8 3.7 9.7 2 11.8 2h.4C14.3 2 16 3.7 16 5.8v.7h2.1c1 0 1.9.8 2 1.8l.9 10.4c.1 1.2-.8 2.3-2 2.3H5c-1.2 0-2.1-1.1-2-2.3l.9-10.4c.1-1 1-1.8 2-1.8H8Zm2 0h4v-.7c0-1-.8-1.8-1.8-1.8h-.4c-1 0-1.8.8-1.8 1.8v.7Zm-2.3 5.1a1 1 0 0 0 0 2h8.6a1 1 0 1 0 0-2H7.7Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function HeroAllowanceIcons({ job }: HeroAllowanceIconsProps) {
  const enabledAllowances = ALLOWANCE_DEFINITIONS.filter(({ key }) =>
    isJobAllowanceEnabled(job[key]),
  );

  const enabledBonuses = BONUS_DEFINITIONS.map((bonus) => ({
    ...bonus,
    value: getPositiveBonus(job[bonus.key]),
  })).filter((bonus) => bonus.value > 0);

  if (enabledAllowances.length === 0 && enabledBonuses.length === 0) {
    return null;
  }

  return (
    <div style={styles.heroAllowanceWrapper} aria-label="Características da classe">
      <div style={styles.heroAllowanceBar}>
        {enabledAllowances.map(({ key, label, icon }) => (
          <span
            key={key}
            title={label}
            aria-label={label}
            style={styles.heroAllowanceChip}
          >
            <span style={styles.heroAllowanceIcon}>{icon}</span>
            <span style={styles.heroAllowanceText}>{label}</span>
          </span>
        ))}

        {enabledBonuses.map(({ key, label, icon, value }) => (
          <span
            key={key}
            title={`Bônus de ${label}: +${value}`}
            aria-label={`Bônus de ${label}: +${value}`}
            style={styles.heroAllowanceChip}
          >
            <span style={styles.heroAllowanceIcon}>{icon}</span>
            <span style={styles.heroAllowanceText}>
              +{value} {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

type BackgroundSectionProps = {
  job: Job;
};

function BackgroundSection({ job }: BackgroundSectionProps) {
  const hasAliases = hasItems(job.aliases);
  const hasQuestions = hasItems(job.questions);

  if (!hasAliases && !hasQuestions) {
    return null;
  }

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>Background</h3>

      {hasAliases ? (
        <div style={styles.aliases}>
          {(job.aliases ?? []).map((alias) => (
            <span key={alias.id} style={styles.aliasBadge}>
              {getAliasText(alias)}
            </span>
          ))}
        </div>
      ) : null}

      {hasQuestions ? (
        <div style={styles.list}>
          {(job.questions ?? []).map((question, index) => (
            <div key={question.id} style={styles.infoBox}>
              <div style={styles.infoLabel}>Pergunta {index + 1}</div>
              <div style={styles.infoValue}>{getQuestionText(question)}</div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type PowersSectionProps = {
  powers: JobPower[] | undefined;
};

function PowersSection({ powers }: PowersSectionProps) {
  if (!hasItems(powers)) {
    return null;
  }

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>Poderes</h3>
      <div style={styles.list}>
        {powers.map((power) => (
          <article key={power.id} style={styles.infoBox}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>{power.name}</h4>
              <div style={styles.inlineBadges}>
                {power.type ? (
                  <span style={styles.secondaryBadge}>
                    {renderTokenLabel(power.type)}
                  </span>
                ) : null}
                {power.max_level ? (
                  <span style={styles.secondaryBadge}>
                    Nível máximo {power.max_level}
                  </span>
                ) : null}
              </div>
            </div>
            <p style={styles.text}>{power.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArcanasSection({ arcanas }: { arcanas?: JobArcana[] }) {
  if (!arcanas || arcanas.length === 0) {
    return null;
  }

  return (
    <section style={styles.section}>
      <SectionTitle>Arcanas</SectionTitle>

      <div style={styles.arcanaGrid}>
        {arcanas.map((arcana) => (
          <ArcanaCard key={arcana.id} arcana={arcana} />
        ))}
      </div>
    </section>
  );
}

function ArcanaCard({ arcana }: { arcana: JobArcana }) {
  const details = getArcanaDetails(arcana);

  return (
    <article style={styles.arcanaCard}>
      <div style={styles.arcanaHeader}>
        <h3 style={styles.arcanaTitle}>{arcana.name}</h3>

        <div style={styles.arcanaDomainList}>
          {getArcanaDomains(arcana.domain).map((domain) => (
            <span key={domain} style={styles.arcanaDomainBadge}>
              {domain}
            </span>
          ))}
        </div>
      </div>

      {details.length > 0 ? (
        <div style={styles.arcanaDetails}>
          {details.map((detail) => (
            <div key={detail.label} style={styles.arcanaDetailBlock}>
              <div style={styles.arcanaDetailLabel}>{detail.label}</div>
              <p style={styles.arcanaDetailText}>{detail.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function getArcanaDetails(arcana: JobArcana): Array<{
  label: string;
  value: string;
}> {
  return [
    {
      label: "Efeito de Fusão",
      value: arcana.merge_effect,
    },
    {
      label: "Efeito de Dispensa",
      value: arcana.dismiss_effect,
    },
    {
      label: "Regra Especial",
      value: arcana.special_rule,
    },
  ].filter((detail): detail is { label: string; value: string } =>
    hasArcanaText(detail.value),
  );
}

function hasArcanaText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim().length > 0;
}

function getArcanaDomains(domain: string): string[] {
  return domain
    .split(",")
    .map((item) => capitalizeFirstLetter(item.trim()))
    .filter((item) => item.length > 0);
}

function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

type SpellsSectionProps = {
  spells: JobSpell[] | undefined;
};

function SpellsSection({ spells }: SpellsSectionProps) {
  if (!hasItems(spells)) {
    return null;
  }

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>Magias</h3>
      <div style={styles.list}>
        {spells.map((spell) => (
          <article key={spell.id} style={styles.infoBox}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>{spell.name}</h4>
              <div style={styles.inlineBadges}>
                {spell.type ? (
                  <span style={styles.secondaryBadge}>
                    {renderTokenLabel(spell.type)}
                  </span>
                ) : null}
                {spell.mp_cost !== undefined ? (
                  <span style={styles.secondaryBadge}>
                    MP {renderOptionalValue(spell.mp_cost)}
                  </span>
                ) : null}
              </div>
            </div>

            <div style={styles.spellMetaGrid}>
              {spell.target !== undefined ? (
                <Info label="Alvo" value={renderOptionalValue(spell.target)} />
              ) : null}
              {spell.duration !== undefined ? (
                <Info label="Duração" value={renderOptionalValue(spell.duration)} />
              ) : null}
            </div>

            <p style={styles.text}>{spell.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div style={styles.compactInfo}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  hero: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "8px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  heroMain: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    minWidth: 0,
  },
  heroImageWrapper: {
    width: "112px",
    height: "112px",
    flexShrink: 0,
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    background: "#1e1a16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "10px",
  },
  heroImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  heroInitials: {
    color: "#c9963a",
    fontWeight: 700,
    fontSize: "32px",
  },
  heroText: {
    minWidth: 0,
  },
  heroAllowanceWrapper: {
    marginLeft: "auto",
    minWidth: "220px",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  heroAllowanceTitle: {
    color: "#7a6e5a",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  heroAllowanceBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
  },
  heroAllowanceChip: {
    minHeight: "30px",
    border: "1px solid #7b694b",
    borderRadius: "999px",
    background: "#110e0c",
    color: "#f5efe2",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "6px 10px",
    boxShadow: "0 0 12px rgba(232, 200, 117, 0.12)",
  },
  heroAllowanceIcon: {
    width: "16px",
    height: "16px",
    minWidth: "16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "inherit",
  },
  heroAllowanceText: {
    color: "#d4c9b0",
    fontSize: "12px",
    lineHeight: 1,
    whiteSpace: "nowrap",
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
  heroTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#e8c875",
  },
  tagline: {
    marginTop: "8px",
    color: "#d4c9b0",
    lineHeight: 1.6,
  },
  message: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
  section: {
    background: "#120f0d",
    border: "1px solid #3a2e22",
    borderRadius: "8px",
    padding: "18px",
  },
  sectionTitle: {
    margin: "0 0 14px",
    color: "#c9963a",
    fontSize: "15px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  aliases: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "14px",
  },
  aliasBadge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#1e1a16",
    border: "1px solid #5a4630",
    borderRadius: "999px",
    color: "#d4c9b0",
    fontSize: "12px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoBox: {
    background: "#1e1a16",
    border: "1px solid #3a2e22",
    borderRadius: "6px",
    padding: "14px",
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
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "18px",
  },
  inlineBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
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
  text: {
    margin: 0,
    lineHeight: 1.7,
    color: "#d4c9b0",
    whiteSpace: "pre-wrap",
  },
  spellMetaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "10px",
  },
  compactInfo: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "4px",
    padding: "8px 10px",
  },

  arcanaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  arcanaCard: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  arcanaHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  arcanaTitle: {
    margin: 0,
    color: "#e8c875",
    fontSize: "20px",
    lineHeight: 1.15,
  },

  arcanaDomainList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  arcanaDomainBadge: {
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    background: "#1e1a16",
    color: "#c9963a",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 800,
    lineHeight: 1.2,
  },

  arcanaDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  arcanaDetailBlock: {
    borderTop: "1px solid #34291f",
    paddingTop: "10px",
  },

  arcanaDetailLabel: {
    color: "#9f8f73",
    fontSize: "11px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },

  arcanaDetailText: {
    margin: 0,
    color: "#d4c9b0",
    fontSize: "14px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
  },
};
