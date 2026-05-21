import "./page-state.css";

type ErrorStateProps = {
  title?: string;
  message: string;
  className?: string;
};

export function ErrorState({
  title = "Algo deu errado",
  message,
  className,
}: ErrorStateProps) {
  const classes = ["page-state", "page-state--error", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} role="alert">
      <h2 className="page-state__title">{title}</h2>
      <p className="page-state__description">{message}</p>
    </section>
  );
}