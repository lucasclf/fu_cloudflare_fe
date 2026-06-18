import { LoadMoreButton } from "@/shared/components/load-more-button";
import { usePaginatedList } from "@/shared/hooks/use-paginated-list";
import { getMonsterImageSrc } from "../lib/get-monster-image-src";
import { formatMonsterType } from "../lib/monster-formatters";
import type { MonsterSummary } from "../types/monster";
import panelStyles from "./monster-cards-panel.module.css";

const PAGE_SIZE = 24;

type Props = {
  monsters: MonsterSummary[];
  selectedMonsterId: number | null;
  onSelectMonster: (monsterId: number) => void;
};

export function MonsterCardsPanel({
  monsters,
  selectedMonsterId,
  onSelectMonster,
}: Props) {
  const { visibleItems, hasMore, remaining, loadMore } = usePaginatedList(
    monsters,
    PAGE_SIZE,
  );

  if (monsters.length === 0) {
    return <div className={panelStyles.empty}>Nenhum monstro para exibir.</div>;
  }

  return (
    <>
      <div className={panelStyles.wrapper}>
        {visibleItems.map((monster) => (
          <MonsterSummaryCard
            key={monster.id}
            monster={monster}
            selected={selectedMonsterId === monster.id}
            onClick={() => onSelectMonster(monster.id)}
          />
        ))}
      </div>

      {hasMore ? (
        <LoadMoreButton remaining={remaining} onClick={loadMore} />
      ) : null}
    </>
  );
}

type MonsterSummaryCardProps = {
  monster: MonsterSummary;
  selected: boolean;
  onClick: () => void;
};

function MonsterSummaryCard({
  monster,
  selected,
  onClick,
}: MonsterSummaryCardProps) {
  const imageSrc = getMonsterImageSrc(monster.img_key);

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
            alt={monster.name}
            className={panelStyles.image}
            loading="lazy"
          />
        ) : (
          <div className={panelStyles.imagePlaceholder}>Sem imagem</div>
        )}
      </div>

      <div className={panelStyles.content}>
        <div className={panelStyles.badges}>
          <span className={panelStyles.typeBadge}>
            {formatMonsterType(monster.monster_type)}
          </span>

          <span className={panelStyles.levelBadge}>Nível {monster.level}</span>
        </div>

        <h2 className={panelStyles.title}>{monster.name}</h2>

        <div className={panelStyles.diceGrid}>
          <Die label="DES" value={monster.dexterity_die} />
          <Die label="AST" value={monster.insight_die} />
          <Die label="VIG" value={monster.might_die} />
          <Die label="VON" value={monster.willpower_die} />
        </div>
      </div>
    </button>
  );
}

function Die({ label, value }: { label: string; value: string }) {
  return (
    <div className={panelStyles.die}>
      <span className={panelStyles.dieLabel}>{label}</span>
      <span className={panelStyles.dieValue}>{value}</span>
    </div>
  );
}
