import type { ReactNode } from "react";

import { ContentCard } from "@/shared/components/content-card";
import { PageTitle } from "@/shared/components/page-title";

import "./auth-page-layout.css";

type AuthPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthPageLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthPageLayoutProps) {
  return (
    <div className="auth-page-layout">
      <ContentCard
        as="section"
        variant="elevated"
        padding="lg"
        className="auth-page-layout__card"
      >
        <PageTitle title={title} subtitle={subtitle} />

        <div className="auth-page-layout__content">{children}</div>

        {footer ? (
          <div className="auth-page-layout__footer">{footer}</div>
        ) : null}
      </ContentCard>
    </div>
  );
}
