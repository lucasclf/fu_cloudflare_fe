import type { JobFeatureFilterKey } from "../lib/job-feature-filters";
import {
  ALLOWANCE_DEFINITIONS,
  BONUS_DEFINITIONS,
} from "./job-feature-definitions";

import "./job-allowance-filter-bar.css";

type JobAllowanceFilterBarProps = {
  selectedFeatureKeys: JobFeatureFilterKey[];
  onToggleFeatureKey: (key: JobFeatureFilterKey) => void;
};

export function JobAllowanceFilterBar({
  selectedFeatureKeys,
  onToggleFeatureKey,
}: JobAllowanceFilterBarProps) {
  return (
    <div
      className="job-allowance-filter-bar"
      aria-label="Filtros de características da classe"
    >
      {ALLOWANCE_DEFINITIONS.map(({ key, label, Icon }) => {
        const isActive = selectedFeatureKeys.includes(key);

        return (
          <button
            key={key}
            type="button"
            className={getFilterButtonClassName(isActive)}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onToggleFeatureKey(key)}
          >
            <Icon />
          </button>
        );
      })}

      {BONUS_DEFINITIONS.map(({ key, label, Icon }) => {
        const isActive = selectedFeatureKeys.includes(key);

        return (
          <button
            key={key}
            type="button"
            className={getFilterButtonClassName(isActive)}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => onToggleFeatureKey(key)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

function getFilterButtonClassName(isActive: boolean): string {
  return [
    "job-allowance-filter-bar__button",
    isActive ? "job-allowance-filter-bar__button--active" : null,
  ]
    .filter(Boolean)
    .join(" ");
}