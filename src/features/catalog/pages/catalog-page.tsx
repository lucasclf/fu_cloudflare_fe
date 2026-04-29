import { ItemsCatalogView } from "../../items/pages/items-catalog-view";
import { JobsCatalogView } from "../../jobs/pages/jobs-catalog-view";
import { SessionsCatalogView } from "../../sessions/pages/sessions-catalog-view";
import { SpellsCatalogView } from "../../spells/pages/spells-catalog-view";
import type { CatalogCategory } from "../types/category";

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

    case "characters":
    case "npcs":
    case "bestiary":
    case "villains":
    case "spells":
    case "places":
      return (
        <div style={styles.comingSoon}>
          <h2 style={styles.title}>Em breve</h2>
          <p style={styles.text}>
            A categoria ainda não foi implementada.
          </p>
        </div>
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
