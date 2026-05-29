import type { ReactNode } from "react";

import "./action-card.css";

type ActionCardProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
};

export function ActionCard({
  children,
  ariaLabel,
  onClick,
  className,
}: ActionCardProps) {
  return (
    <button
      type="button"
      className={getActionCardClassName(className)}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function getActionCardClassName(className: string | undefined): string {
  return ["action-card", className].filter(Boolean).join(" ");
}
