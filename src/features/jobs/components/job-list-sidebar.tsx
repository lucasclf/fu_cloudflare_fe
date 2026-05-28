import { Button } from "@/shared/components/button";
import type { JobCatalogItem } from "../types/job";

import "./job-list-sidebar.css";

type JobListSidebarProps = {
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
}: JobListSidebarProps) {
  return (
    <nav className="job-list-sidebar" aria-label="Lista de classes">
      <div className="job-list-sidebar__actions">
        <Button
          variant="secondary"
          fullWidth
          onClick={onClearSelection}
          disabled={selectedJobId === null}
        >
          Mostrar todas
        </Button>
      </div>

      {jobs.length === 0 ? (
        <p className="job-list-sidebar__empty">Nenhuma classe encontrada.</p>
      ) : (
        <div className="job-list-sidebar__items">
          {jobs.map((job) => {
            const isActive = selectedJobId === job.id;

            return (
              <button
                key={job.id}
                type="button"
                className={getJobButtonClassName(isActive)}
                aria-pressed={isActive}
                onClick={() => onSelect(job.id)}
              >
                <span className="job-list-sidebar__item-title">
                  {job.name}
                </span>

                {job.tagline ? (
                  <span className="job-list-sidebar__item-subtitle">
                    {job.tagline}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function getJobButtonClassName(isActive: boolean): string {
  return [
    "job-list-sidebar__item",
    isActive ? "job-list-sidebar__item--active" : null,
  ]
    .filter(Boolean)
    .join(" ");
}