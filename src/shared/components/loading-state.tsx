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
      <svg
        className="page-state__icon page-state__icon--spin"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-9-9" />
      </svg>

      <span>{message}</span>
    </div>
  );
}
