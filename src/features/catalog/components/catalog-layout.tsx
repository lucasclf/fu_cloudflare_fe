import type { ReactNode } from "react";

type Props = {
  sidebarHeaderTitle: string;
  sidebarHeaderSubtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  categorySwitcher: ReactNode;
  sidebarContent: ReactNode;
  mainContent: ReactNode;
};

export function CatalogLayout({
  sidebarHeaderTitle,
  sidebarHeaderSubtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  categorySwitcher,
  sidebarContent,
  mainContent,
}: Props) {
  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.title}>Grimório</h1>
          <p style={styles.subtitle}>{sidebarHeaderSubtitle}</p>
          <div style={{ marginTop: "14px" }}>{categorySwitcher}</div>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.sidebarList}>
          <div style={styles.sectionHeader}>{sidebarHeaderTitle}</div>
          {sidebarContent}
        </div>
      </aside>

      <main style={styles.main}>{mainContent}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#0e0c0a",
    color: "#d4c9b0",
  },
  sidebar: {
    width: "300px",
    minWidth: "300px",
    background: "#161210",
    borderRight: "1px solid #3a2e22",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "20px 16px 14px",
    borderBottom: "1px solid #3a2e22",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    color: "#c9963a",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#7a6e5a",
  },
  searchWrapper: {
    padding: "12px",
    borderBottom: "1px solid #3a2e22",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 10px",
    background: "#1e1a16",
    border: "1px solid #3a2e22",
    color: "#d4c9b0",
    borderRadius: "4px",
  },
  sidebarList: {
    flex: 1,
    overflowY: "auto",
  },
  sectionHeader: {
    padding: "12px 16px 8px",
    fontSize: "11px",
    color: "#7a6e5a",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 32px",
  },
};