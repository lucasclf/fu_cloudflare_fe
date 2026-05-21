import { ItemsCatalogView } from "../../items/pages/items-catalog-view";
import { JobsCatalogView } from "../../jobs/pages/jobs-catalog-view";
import { SessionsCatalogView } from "../../sessions/pages/sessions-catalog-view";
import { SpellsCatalogView } from "../../spells/pages/spells-catalog-view";
import { PowersCatalogView } from "../../powers/pages/powers-catalog-view";
import { ScenarioCatalogView } from "../../scenario/pages/scenario-catalog-view";
import type { CatalogCategory } from "../types/category";
import { MonstersCatalogView } from "../../monsters/pages/monsters-catalog-view";
import { NpcsCatalogView } from "../../npcs/pages/npcs-catalog-view";
import { PcsCatalogView } from "../../pcs/pages/pcs-catalog-view";

type CatalogPageProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function CatalogPage({
  category,
  onCategoryChange,
}: CatalogPageProps) {
  switch (category) {
    case "sessions":
      return (
        <SessionsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );

    case "items":
      return (
        <ItemsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );

    case "classes":
      return (
        <JobsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );
    
    case "spells":
      return (
        <SpellsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );

    case "powers":
      return (
        <PowersCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );
    case "scenario":
      return (
        <ScenarioCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );
    case "bestiary":
      return (
        <MonstersCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );
      case "npcs":
        return (
          <NpcsCatalogView
            category={category}
            onCategoryChange={onCategoryChange}
          />
        );
    case "characters":
      return (
        <PcsCatalogView
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );

    default:
      return (
        <div style={styles.comingSoon}>
          <h2 style={styles.title}>Categoria inválida</h2>
        </div>
      );
  }
}

const styles: Record<string, React.CSSProperties> = {
  comingSoon: {
    minHeight: "100vh",
    background: "#0e0c0a",
    color: "#d4c9b0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    textAlign: "center",
    padding: "24px",
  },
  title: {
    margin: 0,
    color: "#c9963a",
    fontSize: "28px",
  },
  text: {
    margin: 0,
    color: "#7a6e5a",
  },
};
