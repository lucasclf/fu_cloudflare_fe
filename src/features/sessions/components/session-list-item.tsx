import type { Session } from "../types/session";

type SessionListItemProps = {
  session: Session;
};

export function SessionListItem({ session }: SessionListItemProps) {
  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <span style={styles.badge}>Sessão {session.session_number}</span>
        <span style={styles.date}>{session.played_at}</span>
      </div>

      <h2 style={styles.title}>{session.title ?? `Sessão ${session.session_number}`}</h2>
      <p style={styles.summary}>{session.summary}</p>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#1e293b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#334155",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
  },
  date: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "22px",
  },
  summary: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
};