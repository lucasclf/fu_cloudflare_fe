import type { ReactNode } from "react";

import "./content-section.css";

type ContentSectionProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ContentSection({
  title,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section className={getContentSectionClassName(className)}>
      <h3 className="content-section__title">{title}</h3>

      <div className="content-section__body">{children}</div>
    </section>
  );
}

function getContentSectionClassName(className: string | undefined): string {
  return ["content-section", className].filter(Boolean).join(" ");
}
