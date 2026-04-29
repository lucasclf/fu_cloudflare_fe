import type { JobCatalogItem } from "../types/job";

const ALL_JOBS_ID = "all";

type Props = {
  jobs: JobCatalogItem[];
  selectedJobId: number | null;
  onSelect: (jobId: number) => void;
  onClearSelection: () => void;
};

export function JobListSidebar({
  jobs,
  selectedJobId,
  onSelect,
  onClearSelection,
}: Props) {
  return (
    <div>
      <button onClick={onClearSelection} style={styles.clearButton}>
        Mostrar todas
      </button>

      {jobs.length === 0 ? (
        <div style={styles.empty}>Nenhuma classe encontrada.</div>
      ) : (
        jobs.map((job) => {
          const isActive = selectedJobId === job.id;

          return (
            <button
              key={`${ALL_JOBS_ID}-${job.id}`}
              onClick={() => onSelect(job.id)}
              style={{
                ...styles.item,
                ...(isActive ? styles.itemActive : {}),
              }}
            >
              <div style={styles.itemTitle}>{job.name}</div>
              {job.tagline ? (
                <div style={styles.itemSubtitle}>{job.tagline}</div>
              ) : null}
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
