import type { CSSProperties } from "react";

type MonsterTypeCount = {
  type: string;
  label: string;
  count: number;
};

type Props = {
  typeCounts: MonsterTypeCount[];
  selectedType: string | null;
  totalCount: number;
  onSelectType: (type: string | null) => void;
};

export function MonsterTypeFilter({
  typeCounts,
  selectedType,
  totalCount,
  onSelectType,
}: Props) {
  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        onClick={() => onSelectType(null)}
        style={{
          ...styles.button,
          ...(selectedType === null ? styles.buttonActive : {}),
        }}
      >
        <span>Todos os tipos</span>
        <span style={styles.count}>{totalCount}</span>
      </button>

      {typeCounts.map(({ type, label, count }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelectType(type)}
          style={{
            ...styles.button,
            ...(selectedType === type ? styles.buttonActive : {}),
          }}
        >
          <span>{label}</span>
          <span style={styles.count}>{count}</span>
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    padding: "12px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  button: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    color: "#7a6e5a",
    padding: "9px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
  },

  buttonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },

  count: {
    color: "#9f8f73",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
};