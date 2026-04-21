type SessionFilterProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function SessionFilter({
  value,
  onChange,
  onSearch,
  onClear,
}: SessionFilterProps) {
  return (
    <div style={styles.wrapper}>
      <input
        type="number"
        min="0"
        placeholder="Número da sessão"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={styles.input}
      />

      <button onClick={onSearch} style={styles.primaryButton}>
        Buscar
      </button>

      <button onClick={onClear} style={styles.secondaryButton}>
        Limpar filtro
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  input: {
    minWidth: "220px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
  },
  primaryButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "#1e293b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};