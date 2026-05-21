import type { Session } from "../types/session";

type Props = {
  sessions: Session[];
  selectedSessionId: number | null;
  onSelect: (sessionId: number) => void;
  onClearSelection: () => void;
};

export function SessionListSidebar({
  sessions,
  selectedSessionId,
  onSelect,
  onClearSelection,
}: Props) {
  return (
    <div>
      <button onClick={onClearSelection} style={styles.clearButton}>
        Mostrar todas
      </button>

      {sessions.length === 0 ? (
        <div style={styles.empty}>Nenhuma sessão encontrada.</div>
      ) : (
        sessions.map((session) => {
          const isActive = selectedSessionId === session.id;

          return (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              style={{
                ...styles.item,
                ...(isActive ? styles.itemActive : {}),
              }}
            >
              <div style={styles.itemTitle}>Sessão {session.session_number}</div>
              <div style={styles.itemSubtitle}>
                {session.title ?? `Sessão ${session.session_number}`}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  clearButton: {
    width: "calc(100% - 24px)",
    margin: "0 12px 10px",
    padding: "8px 10px",
    background: "transparent",
    border: "1px solid #7a5a22",
    color: "#c9963a",
    borderRadius: "4px",
    cursor: "pointer",
  },
  empty: {
    padding: "16px",
    color: "#7a6e5a",
    fontStyle: "italic",
  },
  item: {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    borderLeft: "2px solid transparent",
    padding: "10px 16px",
    cursor: "pointer",
    color: "#d4c9b0",
  },
  itemActive: {
    background: "#1e1a16",
    borderLeft: "2px solid #c9963a",
  },
  itemTitle: {
    fontSize: "13px",
    color: "#e8c875",
    fontWeight: 700,
  },
  itemSubtitle: {
    marginTop: "2px",
    fontSize: "13px",
    color: "#7a6e5a",
  },
};