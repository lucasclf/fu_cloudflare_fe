import "./page-state.css";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Carregando...",
  className,
}: LoadingStateProps) {
  const classes = ["page-state", "page-state--loading", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      {message}
    </div>
  );
}