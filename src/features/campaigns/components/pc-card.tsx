import type { PcHomeStats } from "../types/campaign";
import "./pc-card.css";

type PcCardProps = {
  pc: PcHomeStats;
};

export function PcCard({ pc }: PcCardProps) {
  const jobsLabel = pc.jobs.map((j) => j.name).join(" / ");

  return (
    <div className="pc-card">
      {pc.img_key ? (
        <div className="pc-card__avatar">
          <img src={pc.img_key} alt={pc.name} />
        </div>
      ) : (
        <div className="pc-card__avatar pc-card__avatar--placeholder" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      )}

      <div className="pc-card__info">
        <h3 className="pc-card__name">{pc.name}</h3>
        {pc.tagline ? <p className="pc-card__tagline">"{pc.tagline}"</p> : null}
        <p className="pc-card__meta">
          Nível {pc.level}
          {jobsLabel ? <> · {jobsLabel}</> : null}
        </p>
      </div>

      <dl className="pc-card__stats">
        <div className="pc-card__stat">
          <dt>PV</dt>
          <dd>{pc.hp}</dd>
        </div>
        <div className="pc-card__stat">
          <dt>PM</dt>
          <dd>{pc.mp}</dd>
        </div>
        <div className="pc-card__stat">
          <dt>INI</dt>
          <dd>{pc.initiative}</dd>
        </div>
        <div className="pc-card__stat">
          <dt>DEF</dt>
          <dd>{pc.defense}</dd>
        </div>
        <div className="pc-card__stat">
          <dt>M.DEF</dt>
          <dd>{pc.magic_defense}</dd>
        </div>
        <div className="pc-card__stat">
          <dt>IP</dt>
          <dd>{pc.ip}</dd>
        </div>
      </dl>
    </div>
  );
}
