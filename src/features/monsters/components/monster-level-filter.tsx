import styles from "./monster-level-filter.module.css";

type MonsterLevelFilterProps = {
  minLevel: string;
  maxLevel: string;
  onMinLevelChange: (value: string) => void;
  onMaxLevelChange: (value: string) => void;
};

export function MonsterLevelFilter({
  minLevel,
  maxLevel,
  onMinLevelChange,
  onMaxLevelChange,
}: MonsterLevelFilterProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Filtro por nível</div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Mínimo</span>
          <input
            type="number"
            min={0}
            value={minLevel}
            onChange={(event) => onMinLevelChange(event.target.value)}
            placeholder="Sem mínimo"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Máximo</span>
          <input
            type="number"
            min={0}
            value={maxLevel}
            onChange={(event) => onMaxLevelChange(event.target.value)}
            placeholder="Sem máximo"
            className={styles.input}
          />
        </label>
      </div>
    </div>
  );
}
