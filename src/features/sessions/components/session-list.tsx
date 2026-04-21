import type { Session } from "../types/session";
import { SessionListItem } from "./session-list-item";

type SessionListProps = {
  sessions: Session[];
};

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return <p style={styles.empty}>Nenhuma sessão encontrada.</p>;
  }

  return (
    <div style={styles.list}>
      {sessions.map((session) => (
        <SessionListItem key={session.id} session={session} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  empty: {
    color: "#94a3b8",
  },
};