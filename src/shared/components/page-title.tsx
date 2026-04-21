type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>{title}</h1>
      {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: 1.2,
  },
  subtitle: {
    marginTop: "8px",
    color: "#94a3b8",
    fontSize: "16px",
  },
};