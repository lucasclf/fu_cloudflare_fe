import { Link } from "react-router-dom";
import type { Category } from "../types/category";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const content = (
    <div
      style={{
        ...styles.card,
        opacity: category.enabled ? 1 : 0.7,
        cursor: category.enabled ? "pointer" : "default",
      }}
    >
      <div style={styles.imageWrapper}>
        <img
          src={category.imageUrl}
          alt={category.name}
          style={styles.image}
        />
      </div>
      <div style={styles.label}>{category.name}</div>
    </div>
  );

  if (category.enabled && category.path) {
    return (
      <Link to={category.path} style={styles.link}>
        {content}
      </Link>
    );
  }

  return content;
}

const styles: Record<string, React.CSSProperties> = {
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s ease",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  label: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: 600,
    color: "#f8fafc",
  },
};