import type { ReactNode } from "react";

import "./info-box.css";

type InfoBoxProps = {
  label: ReactNode;
  value?: ReactNode;
  compact?: boolean;
  children?: ReactNode;
};

export function InfoBox({
  label,
  value,
  compact = false,
  children,
}: InfoBoxProps) {
  return (
    <div className={getInfoBoxClassName(compact)}>
      <div className="info-box__label">{label}</div>
      <div className="info-box__value">{children ?? value}</div>
    </div>
  );
}

function getInfoBoxClassName(compact: boolean): string {
  return ["info-box", compact ? "info-box--compact" : null]
    .filter(Boolean)
    .join(" ");
}
