import type { CSSProperties } from "react";

type Props = {
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
}: Props) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Filtro por nível</div>

      <div style={styles.fields}>
        <label style={styles.field}>
          <span style={styles.label}>Mínimo</span>
          <input
            type="number"
            min={0}
            value={minLevel}
            onChange={(event) => onMinLevelChange(event.target.value)}
            placeholder="Sem mínimo"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Máximo</span>
          <input
            type="number"
            min={0}
            value={maxLevel}
            onChange={(event) => onMaxLevelChange(event.target.value)}
            placeholder="Sem máximo"
            style={styles.input}
          />
        </label>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    padding: "12px 16px",
    borderBottom: "1px solid #34291f",
  },

  title: {
    color: "#d7c7a8",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  },

  fields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  label: {
    color: "#7a6e5a",
    fontSize: "11px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    color: "#f5efe2",
    padding: "8px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
};