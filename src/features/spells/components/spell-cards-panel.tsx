import panelStyles from "./spell-cards-panel.module.css";
import {
  getSpellSourceName,
  isSpellOffensive,
  renderSpellValue,
} from "../lib/spell-formatters";
import type { Spell } from "../types/spell";

type Props = {
  spells: Spell[];
};

export function SpellCardsPanel({ spells }: Props) {
  if (spells.length === 0) {
    return <div className={panelStyles.empty}>Nenhuma magia para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {spells.map((spell) => (
        <SpellCard key={getSpellCardKey(spell)} spell={spell} />
      ))}
    </div>
  );
}

type SpellCardProps = {
  spell: Spell;
};

function getSpellCardKey(spell: Spell): string {
  if (spell.nature === "monster") {
    return `monster-${spell.id}`;
  }

  return `job-${spell.job_id ?? "unknown"}-${spell.id}`;
}

function SpellCard({ spell }: SpellCardProps) {
  const offensive = isSpellOffensive(spell.is_offensive);
  const sourceName = getSpellSourceName(spell);

  return (
    <article className={panelStyles.card}>
      <div className={panelStyles.header}>
        <div className={panelStyles.badges}>
          <span className={panelStyles.jobBadge}>{sourceName}</span>

          <span
            className={[
              panelStyles.typeBadge,
              offensive ? panelStyles.offensiveBadge : panelStyles.supportBadge,
            ].join(" ")}
          >
            {offensive ? "Ofensiva" : "Não ofensiva"}
          </span>
        </div>

        <h2 className={panelStyles.title}>{spell.name}</h2>
      </div>

      <p className={panelStyles.description}>{renderSpellValue(spell.description)}</p>

      <div className={panelStyles.infoGrid}>
        <Info label="Custo" value={renderSpellValue(spell.cost)} />
        <Info label="Alvo" value={renderSpellValue(spell.target)} />
        <Info label="Duração" value={renderSpellValue(spell.duration)} />
      </div>
    </article>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div className={panelStyles.info}>
      <div className={panelStyles.infoLabel}>{label}</div>
      <div className={panelStyles.infoValue}>{value}</div>
    </div>
  );
}
