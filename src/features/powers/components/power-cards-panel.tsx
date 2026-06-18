import panelStyles from "./power-cards-panel.module.css";
import {
  formatMaxLevel,
  formatPowerType,
  getPowerJobNames,
  isPowerUnrestricted,
} from "../lib/power-formatters";
import type { Power } from "../types/power";

type Props = {
  powers: Power[];
};

export function PowerCardsPanel({ powers }: Props) {
  if (powers.length === 0) {
    return <div className={panelStyles.empty}>Nenhum poder para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {powers.map((power) => (
        <PowerCard key={power.id} power={power} />
      ))}
    </div>
  );
}

type PowerCardProps = {
  power: Power;
};

function PowerCard({ power }: PowerCardProps) {
  const jobNames = getPowerJobNames(power);
  const unrestricted = isPowerUnrestricted(power);
  const heroic = power.type === "heroic";

  return (
    <article className={panelStyles.card}>
      <div className={panelStyles.header}>
        <div className={panelStyles.badges}>
          <span
            className={[
              panelStyles.typeBadge,
              heroic ? panelStyles.heroicBadge : panelStyles.commonBadge,
            ].join(" ")}
          >
            {formatPowerType(power.type)}
          </span>

          <span className={panelStyles.levelBadge}>
            {formatMaxLevel(power.max_level)}
          </span>

          {power.is_global ? (
            <span className={panelStyles.globalBadge}>Global</span>
          ) : null}
        </div>

        <h2 className={panelStyles.title}>{power.name}</h2>
      </div>

      <div className={panelStyles.jobs}>
        {unrestricted ? (
          <span className={panelStyles.unrestrictedJobBadge}>
            Sem restrição de classe
          </span>
        ) : (
          jobNames.map((jobName) => (
            <span key={jobName} className={panelStyles.jobBadge}>
              {jobName}
            </span>
          ))
        )}
      </div>

      <p className={panelStyles.description}>{power.description}</p>
    </article>
  );
}
