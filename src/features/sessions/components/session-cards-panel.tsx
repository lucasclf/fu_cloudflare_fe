import type { Session } from "../types/session";
import { SessionCard } from "./session-card";

type Props = {
  sessions: Session[];
};

export function SessionCardsPanel({ sessions }: Props) {
  if (sessions.length === 0) {
    return <div style={styles.empty}>Nenhuma sessão para exibir.</div>;
  }

  return (
    <div style={styles.wrapper}>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  empty: {
    color: "#7a6e5a",
    fontStyle: "italic",
  },
};