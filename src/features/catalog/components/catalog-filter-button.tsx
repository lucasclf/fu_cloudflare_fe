import styles from "./catalog-filter-button.module.css";

type CatalogFilterButtonProps = {
  label: string;
  count?: string;
  isActive: boolean;
  onClick: () => void;
};

export function CatalogFilterButton({
  label,
  count,
  isActive,
  onClick,
}: CatalogFilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
    >
      <span>{label}</span>
      {count != null && <span className={styles.count}>{count}</span>}
    </button>
  );
}
