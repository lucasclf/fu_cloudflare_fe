import { renderPcValue } from "../lib/pc-formatters";
import type { PcSummary } from "../types/pc";
import panelStyles from "./pc-cards-panel.module.css";

type Props = {
  pcs: PcSummary[];
  selectedPcId: number | null;
  onSelectPc: (pcId: number) => void;
};

export function PcCardsPanel({ pcs, selectedPcId, onSelectPc }: Props) {
  if (pcs.length === 0) {
    return <div className={panelStyles.empty}>Nenhum personagem para exibir.</div>;
  }

  return (
    <div className={panelStyles.wrapper}>
      {pcs.map((pc) => (
        <button
          key={pc.id}
          type="button"
          onClick={() => onSelectPc(pc.id)}
          className={[
            panelStyles.card,
            selectedPcId === pc.id && panelStyles.cardSelected,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={panelStyles.imageFrame}>
            {pc.img_key ? (
              <img
                src={pc.img_key}
                alt={pc.name}
                className={panelStyles.image}
                loading="lazy"
              />
            ) : (
              <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
            )}
          </div>

          <div className={panelStyles.content}>
            <h2 className={panelStyles.title}>{pc.name}</h2>
            <p className={panelStyles.tagline}>“{renderPcValue(pc.tagline)}”</p>
          </div>
        </button>
      ))}
    </div>
  );
}
