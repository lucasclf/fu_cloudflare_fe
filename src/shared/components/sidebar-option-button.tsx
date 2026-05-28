import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./sidebar-option-button.css";

type SidebarOptionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isActive?: boolean;
};

export function SidebarOptionButton({
  children,
  isActive = false,
  className,
  type = "button",
  ...props
}: SidebarOptionButtonProps) {
  const classes = [
    "sidebar-option-button",
    isActive ? "sidebar-option-button--active" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} aria-pressed={isActive} {...props}>
      {children}
    </button>
  );
}
