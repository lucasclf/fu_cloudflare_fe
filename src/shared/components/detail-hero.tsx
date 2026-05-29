import type { ReactNode } from "react";

import { Badge } from "./badge";

import "./detail-hero.css";

type DetailHeroProps = {
  badge: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  media: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function DetailHero({
  badge,
  title,
  subtitle,
  media,
  aside,
  className,
}: DetailHeroProps) {
  return (
    <header className={getDetailHeroClassName(className)}>
      <div className="detail-hero__main">
        {media}

        <div className="detail-hero__text">
          <Badge variant="accent">{badge}</Badge>

          <h2 className="detail-hero__title">{title}</h2>

          {subtitle ? (
            <p className="detail-hero__subtitle">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {aside ? <div className="detail-hero__aside">{aside}</div> : null}
    </header>
  );
}

function getDetailHeroClassName(className: string | undefined): string {
  return ["detail-hero", className].filter(Boolean).join(" ");
}
