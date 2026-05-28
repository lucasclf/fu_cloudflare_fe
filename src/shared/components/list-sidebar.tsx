import type { ReactNode } from "react";

import { Button } from "./button";

import "./list-sidebar.css";

type ListSidebarItemId = string | number;

export type ListSidebarItem<TId extends ListSidebarItemId> = {
  id: TId;
  title: ReactNode;
  subtitle?: ReactNode;
};

type ListSidebarProps<TId extends ListSidebarItemId> = {
  ariaLabel: string;
  items: ListSidebarItem<TId>[];
  selectedItemId: TId | null;
  clearSelectionLabel: string;
  emptyMessage: string;
  onSelect: (itemId: TId) => void;
  onClearSelection: () => void;
};

export function ListSidebar<TId extends ListSidebarItemId>({
  ariaLabel,
  items,
  selectedItemId,
  clearSelectionLabel,
  emptyMessage,
  onSelect,
  onClearSelection,
}: ListSidebarProps<TId>) {
  return (
    <nav className="list-sidebar" aria-label={ariaLabel}>
      <div className="list-sidebar__actions">
        <Button
          variant="secondary"
          fullWidth
          onClick={onClearSelection}
          disabled={selectedItemId === null}
        >
          {clearSelectionLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="list-sidebar__empty">{emptyMessage}</p>
      ) : (
        <div className="list-sidebar__items">
          {items.map((item) => {
            const isActive = selectedItemId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={getItemClassName(isActive)}
                aria-pressed={isActive}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(item.id)}
              >
                <span className="list-sidebar__item-title">{item.title}</span>

                {item.subtitle ? (
                  <span className="list-sidebar__item-subtitle">
                    {item.subtitle}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function getItemClassName(isActive: boolean): string {
  return ["list-sidebar__item", isActive ? "list-sidebar__item--active" : null]
    .filter(Boolean)
    .join(" ");
}
