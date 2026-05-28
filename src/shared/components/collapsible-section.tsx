import type { ReactNode } from "react";

import "./collapsible-section.css";

type CollapsibleSectionProps = {
  id: string;
  title: string;
  count?: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function CollapsibleSection({
  id,
  title,
  count,
  isExpanded,
  onToggle,
  children,
  className,
  contentClassName,
}: CollapsibleSectionProps) {
  const sectionClasses = ["collapsible-section", className]
    .filter(Boolean)
    .join(" ");

  const contentClasses = ["collapsible-section__content", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClasses}>
      <button
        type="button"
        className="collapsible-section__header"
        aria-expanded={isExpanded}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="collapsible-section__title">
          {title}

          {typeof count === "number" ? (
            <span className="collapsible-section__count">({count})</span>
          ) : null}
        </span>

        <span className="collapsible-section__icon" aria-hidden>
          {isExpanded ? "−" : "+"}
        </span>
      </button>

      {isExpanded ? (
        <div id={id} className={contentClasses}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
