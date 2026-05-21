import type { Session } from "../types/session";

type Props = {
  session: Session;
};

export function SessionCard({ session }: Props) {
  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>Sessão {session.session_number}</div>
          <h2 style={styles.title}>
            {session.title ?? `Sessão ${session.session_number}`}
          </h2>
        </div>
        <div style={styles.date}>{session.played_at}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Resumo</div>
        <p style={styles.text}>{session.summary}</p>
      </div>

      {session.notes ? (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Notas</div>
          <p style={styles.text}>{session.notes}</p>
        </div>
      ) : null}
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#161210",
    border: "1px solid #3a2e22",
    borderRadius: "6px",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#1e1a16",
    border: "1px solid #7a5a22",
    borderRadius: "999px",
    color: "#c9963a",
    fontSize: "12px",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#e8c875",
  },
  date: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
  section: {
    marginTop: "16px",
  },
  sectionTitle: {
    marginBottom: "8px",
    fontSize: "12px",
    color: "#c9963a",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  text: {
    margin: 0,
    lineHeight: 1.7,
    color: "#d4c9b0",
    whiteSpace: "pre-wrap",
  },
};