import type { ReactNode } from "react";

import { PageTitle } from "./page-title";

import "./page-header.css";

type PageHeaderVariant = "default" | "compact";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: PageHeaderVariant;
};

export function PageHeader({
  title,
  subtitle,
  actions,
  children,
  className,
  variant = "default",
}: PageHeaderProps) {
  const classes = [
    "page-header",
    `page-header--${variant}`,
    actions ? "page-header--with-actions" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <PageTitle title={title} subtitle={subtitle} />

      {actions ? <div className="page-header__actions">{actions}</div> : null}

      {children ? <div className="page-header__content">{children}</div> : null}
    </section>
  );
}
