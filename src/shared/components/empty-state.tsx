import "./page-state.css";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  const classes = ["page-state", "page-state--empty", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <svg
        className="page-state__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 5.5C5 4 8 3.5 12 4.5c4-1 7-.5 9 1v14c-2-1.5-5-2-9-1-4-1-7-.5-9 1v-14Z" />
        <path d="M12 4.5v14" />
      </svg>

      <div className="page-state__content">
        <h2 className="page-state__title">{title}</h2>

        {description ? (
          <p className="page-state__description">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
