import { useState, type ReactNode } from "react";

type JobDetailSectionProps = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function JobDetailSection({
  title,
  count,
  defaultOpen = true,
  children,
}: JobDetailSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="job-detail-panel__section">
      <button
        type="button"
        className="job-detail-panel__section-header"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="job-detail-panel__section-header-main">
          <span className="job-detail-panel__section-chevron" aria-hidden>
            {open ? "▾" : "▸"}
          </span>

          <span className="job-detail-panel__section-title">{title}</span>

          {typeof count === "number" ? (
            <span className="job-detail-panel__section-count">{count}</span>
          ) : null}
        </span>

        <span className="job-detail-panel__section-action">
          {open ? "Fechar" : "Abrir"}
        </span>
      </button>

      {open ? (
        <div className="job-detail-panel__section-content">{children}</div>
      ) : null}
    </section>
  );
}