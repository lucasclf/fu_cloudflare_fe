import { Outlet, Link } from "react-router-dom";

export function PublicLayout() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/" style={styles.logo}>
            Enciclopédia da Campanha
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    borderBottom: "1px solid #334155",
    backgroundColor: "#111827",
  },
  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
  },
  logo: {
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "24px",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
};