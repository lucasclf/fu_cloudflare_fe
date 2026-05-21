import "./page-state.css";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  className,
}: EmptyStateProps) {
  const classes = ["page-state", "page-state--empty", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <h2 className="page-state__title">{title}</h2>

      {description ? (
        <p className="page-state__description">{description}</p>
      ) : null}
    </section>
  );
}