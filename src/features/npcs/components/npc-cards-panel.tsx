import { getNpcImageSrc } from "../lib/get-npc-image-src";
import { renderNpcValue } from "../lib/npc-formatters";
import type { NpcSummary } from "../types/npc";
import panelStyles from "./npc-cards-panel.module.css";

type Props = {
  npcs: NpcSummary[];
  selectedNpcId: number | null;
  onSelectNpc: (npcId: number) => void;
};

export function NpcCardsPanel({ npcs, selectedNpcId, onSelectNpc }: Props) {
  if (npcs.length === 0) {
    return <div className={panelStyles.empty}>Nenhum NPC para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {npcs.map((npc) => (
        <NpcSummaryCard
          key={npc.id}
          npc={npc}
          selected={selectedNpcId === npc.id}
          onClick={() => onSelectNpc(npc.id)}
        />
      ))}
    </div>
  );
}

function NpcSummaryCard({
  npc,
  selected,
  onClick,
}: {
  npc: NpcSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const imageSrc = getNpcImageSrc(npc.img_key);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[panelStyles.card, selected && panelStyles.cardSelected]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={panelStyles.imageFrame}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={npc.name}
            className={panelStyles.image}
            loading="lazy"
          />
        ) : (
          <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div className={panelStyles.content}>
        <h2 className={panelStyles.title}>{npc.name}</h2>

        <p className={panelStyles.tagline}>“{renderNpcValue(npc.tagline)}”</p>

        <div className={panelStyles.infoGrid}>
          <Info label="Nível" value={npc.level} />
          <Info label="DES" value={npc.dexterity_die} />
          <Info label="AST" value={npc.insight_die} />
          <Info label="VIG" value={npc.might_die} />
          <Info label="VON" value={npc.willpower_die} />
        </div>
      </div>
    </button>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className={panelStyles.info}>
      <span className={panelStyles.infoLabel}>{label}</span>
      <span className={panelStyles.infoValue}>{renderNpcValue(value)}</span>
    </div>
  );
}
